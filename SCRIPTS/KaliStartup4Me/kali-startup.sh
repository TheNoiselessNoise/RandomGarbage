#!/bin/bash
RED='==========[ '
NC=' ]=========='

# first, it need an update of a system
apt update -y
apt upgrade -y
apt -f install -y
apt autoremove -y

# check for a steam
STEAM=$(whereis steam | awk '{ print $2 }')
A=$(dpkg --print-foreign-architectures)
echo "${RED}STARTUP STUFF ...${NC}"
apt -qq -y update

if [[ $A = *"i386"* ]]; then
	echo "${RED}MODPROBING ...${NC}"
else
	dpkg --add-architecture i386
fi

# fix my touchpad
modprobe -r psmouse
modprobe psmouse proto=imps
echo "options psmouse proto=imps" >> /etc/modprobe.d/touchpadfix.conf

# check if steam is downloaded, if not, download it
cd Downloads
if [ ! -f /root/Downloads/steam.deb ]; then
	echo "${RED}DOWNLOADING STEAM ...${NC}"
	wget -quiet https://steamcdn-a.akamaihd.net/client/installer/steam.deb
else
	echo "${RED}STEAM INSTALLATION FILE WAS FOUND, SKIPPING ...${NC}"
fi

# check if steam is installed, if not, install it
if [ $(dpkg -l | grep steam | awk '{ print $1 }') != "ii" ]; then
        echo "${RED}INSTALLING STEAM ...${NC}"
	dpkg -i steam.deb > /dev/null 2>&1
	apt -qq -y -f install
else
	echo "${RED}STEAM WAS FOUND ON THE SYSTEM, SKIPPING ...${NC}"
fi

# install required libraries for steam
echo "${RED}INSTALLING LIBRARIES FOR STEAM ...${NC}"
apt -qq -y install libc-dev:amd64 libc6-dev libgl1-mesa-dri:i386 libgl1-mesa-glx:i386

# are required libraries where they should be?
if [ ! -f /lib/libc.so.6 ]; then
	sudo ln -s /lib/i386-linux-gnu/libc.so.6 /lib/libc.so.6
fi

# check for update again, for 
apt -qq -y -f install
apt -qq -y autoremove
ldconfig

# are required libraries where they should be, again?
if [ ! -f /lib/libGL.so.1 ]; then
	ln -s /usr/lib/x86_64-linux-gnu/libGL.so.1 /lib/libGL.so.1
fi

if [ ! -f /usr/lib/libGL.so.1 ]; then
	ln -s /usr/lib/x86_64-linux-gnu/libGL.so.1 /usr/lib/libGL.so.1
fi

if [ ! -f /lib/libdrm.so.2 ]; then
	ln -s /usr/lib/x86_64-linux-gnu/libdrm.so.2 /lib/libdrm.so.2
fi

if [ ! -f /usr/lib/libdrm.so.2 ]; then
	ln -s /usr/lib/x86_64-linux-gnu/libdrm.so.2 /usr/lib/libdrm.so.2
fi

# enable root to run steam without that stupid warning about running as root
# maybe it's good warning for security reasons, but i don't care, thank you
if [ $STEAM != "" ]; then
	sed '138s/.*/#&/' $(whereis steam | awk '{ print $2 }') > tmp.txt
	mv tmp.txt $(whereis steam | awk '{ print $2 }')
	sed '139s/.*/#&/' $(whereis steam | awk '{ print $2 }') > tmp.txt
	mv tmp.txt $(whereis steam | awk '{ print $2 }')
	sed '140s/.*/#&/' $(whereis steam | awk '{ print $2 }') > tmp.txt
	mv tmp.txt $(whereis steam | awk '{ print $2 }')
	sed '141s/.*/#&/' $(whereis steam | awk '{ print $2 }') > tmp.txt
	mv tmp.txt $(whereis steam | awk '{ print $2 }')
	if [ ! -f /usr/local/bin/steam ]; then
		ln -s $(whereis steam | awk '{ print $2 }') /usr/local/bin/steam
	fi
	chmod 777 /usr/local/bin/steam
fi
