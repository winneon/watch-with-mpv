#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <boost/format.hpp>
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

child run_mpv(string url, path tmp_path)
{
    string command = (boost::format("\
mpv --msg-level=all=info \
--cookies --cookies-file=\"%s\" \
--ytdl-raw-options=cookies=\"%s\" \
\"%s\"") % tmp_path.string() % tmp_path.string() % url).str();

    ipstream pipe_stream;
    child c (command, std_out > pipe_stream);

    string line;

    while (pipe_stream && getline(pipe_stream, line) && !line.empty())
    {
        cerr << line << endl;
    }

    return c;
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
            cerr << "Unable to parse the provided json." << endl;
        }
        else
        {
            Value& array = document["cookies"];
            vector<string> cookies = { };

            for (SizeType i = 0; i < array.Size(); i++)
            {
                cookies.push_back(array[i].GetString());
            }

            path tmp_path = write_cookies_file(cookies);

            if (!tmp_path.empty())
            {
                child c = run_mpv(document["text"].GetString(), tmp_path);

                cerr << "testing!" << endl;
            }
            else
            {
                cerr << "Unable to write cookies file." << endl;
            }
        }
    }

    return 0;
}
