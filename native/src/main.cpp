#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <boost/filesystem.hpp>
#include <boost/process.hpp>
#include <rapidjson/document.h>

#define MPV_COMMAND(str)

using namespace std;
using namespace boost::filesystem;
using namespace boost::process;
using namespace rapidjson;

path write_cookies_file(vector<string> cookies)
{
    path cookies_path ("cookies.txt");
    path full_path = temp_directory_path() / cookies_path;

    boost::filesystem::ofstream tmp (full_path);

    if (tmp.is_open())
    {
        for (int i = 0; i < cookies.size(); i++)
        {
            tmp << cookies[i] << endl;
        }

        tmp.close();
        return full_path;
    }

    return path ("");
}

void run_mpv(string url, path tmp_path)
{
    stringstream fmt;
    fmt << "mpv --msg-level=all=info --cookies --cookies-file=\"" << tmp_path.string() << "\" --ytdl-raw-options=cookies=\"" << tmp_path.string() << "\" \"" << url << "\"";

    ipstream pipe_stream;
    child c (fmt.str(), std_out > pipe_stream);

    string line;

    while (pipe_stream && getline(pipe_stream, line) && !line.empty())
    {
        cerr << line << endl;
    }

    c.wait();
}

int main(int argc, char *argv[])
{
    while (true)
    {
        unsigned int length = 0;

        for (int i = 0; i < 4; i++)
        {
            unsigned int read = getchar();
            length = length | (read << i * 8);
        }

        string json = "";

        for (int i = 0; i < length; i++)
        {
            json += getchar();
        }

        Document document;

        if (document.Parse(json.c_str()).HasParseError())
        {
            return 1;
        }

        Value &array = document["cookies"];
        vector<string> cookies = { };

        for (SizeType i = 0; i < array.Size(); i++)
        {
            cookies.push_back(array[i].GetString());
        }

        path tmp_path = write_cookies_file(cookies);

        if (!tmp_path.empty())
        {
            run_mpv(document["text"].GetString(), tmp_path);
        }
        else
        {
            cerr << "Unable to write cookies file." << endl;
        }
    }

    return 0;
}
