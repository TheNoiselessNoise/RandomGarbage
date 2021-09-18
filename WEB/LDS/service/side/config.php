<?php
	if(!isset($_COOKIE["lds_lang"])){
		setcookie("lds_lang", "en", time()+(60*60*24*30));
		header("Refresh:0");
		exit();
	}

	if($_COOKIE["lds_lang"] == "en"){
		// EN
		define("RECAPTCHA_WRONG", "Wrong captcha value!");
		define("RECAPTCHA_EMPTY", "Empty captcha!");
		define("RECAPTCHA_MANIPULATED", "Captcha was manipulated!");
		define("LOGIN_EMPTY_EMAIL_OR_PASS", "Email or password field was empty!");
		define("LOGIN_SUCCESSFUL", "Login was successful!");
		define("LOGIN_WRONG", "Incorrect username or password!");
		define("LOGIN_SOMEWRONG", "Something is wrong here...looks like 2 same accounts!");
		define("REGISTER_ADMIN_EXISTS", "Registration disabled due to admin existence.");
		#define("REGISTER_WRONG_EMAIL_FORMAT", "Email is in wrong format!");
		define("REGISTER_PASSWORD_DONT_MATCH", "Password do not match!");
		define("REGISTER_USERNAME_SHORT", "Username is too short!");
		define("REGISTER_PASSWORD_SHORT", "Password is too short!");
		define("REGISTER_EMPTY_VALUES", "Please, fill up all fields!");
		define("REGISTER_SUCCESSFUL", "Registration was successful!");
		define("REGISTER_FAIL", "Registration failed!");
		define("NO_PRIMARY_KEY", "No primary key found for this table!");
		define("INVALID_PRIMARY_KEY", "Primary key is invalid!");
		define("DATABASE_DELETE_SUCCESS", "Database successfuly deleted!");
		define("DATABASE_DELETE_FAIL", "Database could not be deleted!");
		define("DATABASE_ADD_SUCCESS", "Database successfuly added!");
		define("DATABASE_ADD_FAIL", "Database could not be added!");
		define("TABLE_DELETE_SUCCESS", "Table successfuly deleted!");
		define("TABLE_DELETE_FAIL", "Table could not be deleted!");
		define("TABLE_ADD_SUCCESS", "Table successfuly added!");
		define("TABLE_ADD_FAIL", "Table could not be added!");
		define("CHANGE_PASSWORD_EMPTY_VALUES", "Please, fill up all fields!");
		define("CHANGE_PASSWORD_SUCCESS", "Password was successfuly changed!");
		define("CHANGE_PASSWORD_FAIL", "Password could not be changed!");
		define("CHANGE_PASSWORD_ORIGINAL_DONT_MATCH", "Original password do not match!");
		define("CHANGE_PASSWORD_NEW_DONT_MATCH", "New password do not match!");
		define("CHANGE_PASSWORD_WONT_CHANGE", "You don't even want to change password!");
		define("ADD_MOD_EMPTY_VALUES", "Please, fill up all fields!");
		define("ADD_MOD_SUCCESS", "Moderator was successfuly added!");
		define("ADD_MOD_FAIL", "Moderator could not be added!");
		define("DONT_HAVE_PERMISSION", "You don't have permission to do this!");
		define("SOMETHING_WRONG", "Something is wrong there!");
	} else if($_COOKIE["lds_lang"] == "cz"){
		// CZ
		define("RECAPTCHA_WRONG", "Špatná CAPTCHA hodnota!");
		define("RECAPTCHA_EMPTY", "Prázdná CAPTCHA!");
		define("RECAPTCHA_MANIPULATED", "CAPTCHA byla změněna!");
		define("LOGIN_EMPTY_EMAIL_OR_PASS", "Pole emailu nebo hesla je prázdné!");
		define("LOGIN_SUCCESSFUL", "Přihlášení bylo úspěšné!");
		define("LOGIN_WRONG", "Špatné přihlašovací jméno nebo heslo!");
		define("LOGIN_SOMEWRONG", "Něco je tu špatně...vypadá to že takový účet už existuje!");
		define("REGISTER_ADMIN_EXISTS", "Registrace zakázana díky existenci administrátora!");
		#define("REGISTER_WRONG_EMAIL_FORMAT", "Email je ve špatném formátu!");
		define("REGISTER_PASSWORD_DONT_MATCH", "Heslo se neshoduje!");
		define("REGISTER_USERNAME_SHORT", "Přihlašovací jméno je příliš krátké!");
		define("REGISTER_PASSWORD_SHORT", "Heslo je příliš krátké!");
		define("REGISTER_EMPTY_VALUES", "Prosím, vyplňtě všechna pole!");
		define("REGISTER_SUCCESSFUL", "Registrace byla úspěšná!");
		define("REGISTER_FAIL", "Registrace selhala!");
		define("NO_PRIMARY_KEY", "Žádný primární klíč pro tuto tabulku nebyl nalezen!");
		define("INVALID_PRIMARY_KEY", "Primární klíč je neplatný!");
		define("DATABASE_DELETE_SUCCESS", "Database úspěšně smazána!");
		define("DATABASE_DELETE_FAIL", "Databáze nemohla být smazána!");
		define("DATABASE_ADD_SUCCESS", "Databáze úspěšně přidána!");
		define("DATABASE_ADD_FAIL", "Databáze nemohla být přidána!");
		define("TABLE_DELETE_SUCCESS", "Tabulka úspěšně smazána!");
		define("TABLE_DELETE_FAIL", "Tabulka nemohla být smazána!");
		define("TABLE_ADD_SUCCESS", "Tabulka úspěšně přidána!");
		define("TABLE_ADD_FAIL", "Tabulka nemohla být přidána!");
		define("CHANGE_PASSWORD_EMPTY_VALUES", "Prosím, vyplňte všechna pole!");
		define("CHANGE_PASSWORD_SUCCESS", "Heslo úspěšně změněno!");
		define("CHANGE_PASSWORD_FAIL", "Heslo nemohlo být změněno!");
		define("CHANGE_PASSWORD_ORIGINAL_DONT_MATCH", "Staré heslo se neshoduje!");
		define("CHANGE_PASSWORD_NEW_DONT_MATCH", "Nové heslo se neshoduje!");
		define("CHANGE_PASSWORD_WONT_CHANGE", "Vždyť vůbec nechcete změnit heslo!");
		define("ADD_MOD_EMPTY_VALUES", "Prosím, vyplňtě všechna pole!");
		define("ADD_MOD_SUCCESS", "Správce úspěšně přidán!");
		define("ADD_MOD_FAIL", "Správce nemohl být přidán!");
		define("DONT_HAVE_PERMISSION", "Na toto nemáte dostatečné oprávnění!");
		define("SOMETHING_WRONG", "Něco je špatně!");
	} else {
		// DEFAULT
		setcookie("lds_lang", "en", time()+(60*60*24*30));
	}
?>