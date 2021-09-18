# UniversalTrainer32
UniversalTrainer (32bit) is simple editable trainer.

# How to edit
1. See Resources
	- The main thing you should edit is 'MainImage' and 'Sounds' if you want those
2. See 'Predefine()' in 'MainForm.cs'

# How to use (Predefine)
ActivateKey - probably speaks for itself
CodeStructs
	- Id - which will be then assign in KeyStructs
	- Name - which will be then shown in Trainer Form
	- Type - the type which will trainer then read from and write in
	- Address - the address which will trainer then read from and write to
		- Examples
			- base+00001111 - Read/Write to base(running application)+address
			- base+00001111,900 - Read/Write to base(running application)+address,offset1,...offsetN
			- dll_file.dll+00001BAA,0 - Read/Write to dll file of running application+address,offset1,...offsetN
KeyStructs
	- Id - to differentiate
	- CodeId - id of CodeStruct to assign it to this KeyStruct
	- KeyType - 3 types => ADD, SET, UN_FREEZE
	- KeyCode - key to activate this KeyStruct with
	- Prefix - if you want to add some prefix to Name of CodeStruct assigned to this KeyStruct
	- Suffix - if you want to add some suffix to Name of CodeStruct assigned to this KeyStruct
	- Value - default value
	- HelpTip - help text when mouse hover over the CodeStruct Name
	- NotPrefix - only if you want to hide the default text which is added (now only to KeyType UN_FREEZE, "Un/Freeze"), you can still use your own Prefix

Process - process name without file extension
Title - title of your Trainer
Author - mentioned in footer in MainForm of Trainer
AuthorSite - if set, when click on Author text, opens a browser to the link provided
DonateLink - if set, when click on Donate Button, opens a browser to the link provided

@TheNoiselessNoise
