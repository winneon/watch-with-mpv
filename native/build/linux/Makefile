PREFIX ?= /usr
SYSCONFDIR ?= /etc

all:
	@echo "Run 'make install' to install watch-with-mpv-native."

install:
	@echo "Making directories..."
	mkdir -p $(DESTDIR)$(PREFIX)/bin
	mkdir -p $(DESTDIR)$(SYSCONFDIR)/opt/chrome/native-messaging-hosts

	@echo -e "\nInstalling binary..."
	cp -p watch-with-mpv-native-linux $(DESTDIR)$(PREFIX)/bin
	./$(DESTDIR)$(PREFIX)/bin/watch-with-mpv-native-linux

	@echo -e "\nInstalling native host manifest..."
	cp -p moe.winneon.watchwithmpv.json $(DESTDIR)$(SYSCONFDIR)/opt/chrome/native-messaging-hosts

uninstall:
	@echo "Removing files..."
	rm -rf $(DESTDIR)$(PREFIX)/bin/watch-with-mpv-native-linux
	rm -rf $(DESTDIR)$(SYSCONFDIR)/opt/chrome/native-messaging-hosts/moe.winneon.watchwithmpv.json
