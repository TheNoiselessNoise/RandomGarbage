using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using Memory;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Media;
using System.IO;

namespace UniversalTrainer
{
    public enum KeyType
    {
        UN_FREEZE = 1,
        ADD = 2,
        SET = 3
    }

    public enum KeyCode
    {
        HOME = 36,
        INSERT = 45,
        DELETE = 46,
        END = 35,
        PAGEUP = 33,
        PAGEDOWN = 34,
        SEMICOLON = 192,
        DIVIDE = 111,
        MULTIPLY = 106,
        MINUS = 109,
        PLUS = 107,
        DIGIT0 = 48,
        DIGIT1 = 49,
        DIGIT2 = 50,
        DIGIT3 = 51,
        DIGIT4 = 52,
        DIGIT5 = 53,
        DIGIT6 = 54,
        DIGIT7 = 55,
        DIGIT8 = 56,
        DIGIT9 = 57,
        N0 = 96,
        N1 = 97,
        N2 = 98,
        N3 = 99,
        N4 = 100,
        N5 = 101,
        N6 = 102,
        N7 = 103,
        N8 = 104,
        N9 = 105,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
    }

    public struct SimpleTextStruct
    {
        public string Prefix { get; set; }
        public string Suffix { get; set; }
    }

    public class KeyStruct
    {
        public int Id { get; set; }
        public int CodeId { get; set; }
        public KeyType Type { get; set; }
        public KeyCode Code { get; set; }
        public object Value { get; set; }
        public Control _control { get; set; } // NumericUpDown
        public Control _prefix { get; set; } // Label
        public Control _suffix { get; set; } // Label
        public Control _helptip { get; set; } // PictureBox
        public string Prefix { get; set; }
        public string Suffix { get; set; }
        public bool IsPressed { get; set; }
        public string HelpTip { get; set; }

        public KeyStruct(int id, int codeid, KeyType type, KeyCode code, string prefix = null, string suffix = null, int? value = null, string helptip = null)
        {
            Id = id;
            CodeId = codeid;
            Type = type;
            Code = code;
            Prefix = prefix;
            Suffix = suffix;
            Value = (object)value;
            HelpTip = helptip;
        }
    }

    public class ActivateKeyStruct
    {
        public bool IsActivated { get; set; }
        public bool IsPressed { get; set; }
        public KeyCode Code { get; set; }
        public string Text { get; set; }
        public Control _control { get; set; } // Label
        public ActivateKeyStruct(KeyCode keyCode, string text = null)
        {
            Code = keyCode;
            Text = String.IsNullOrEmpty(text) ? "Activate Trainer" : text;
            _control = null;
            IsActivated = false;
            IsPressed = false;
        }
    }

    public class CodeStruct
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Address { get; set; }
        public bool IsFrozen { get; set; }

        public CodeStruct(int id, string name, string type, string address)
        {
            Id = id;
            Name = name;
            Type = type;
            Address = address;
        }
    }

    public class TrainerConfig
    {
        public static ActivateKeyStruct ActivateKey { get; set; }
        public static List<CodeStruct> Codes { get; set; } = null;
        public static List<KeyStruct> Keys { get; set; } = null;
        public static string Title { get; set; } = null;
        public static string Author { get; set; } = null;
        public static string AuthorSite { get; set; } = null;
        public static string DonateLink { get; set; } = null;
        public static Mem mem = new Mem();
        public static SoundPlayer player { get; } = new SoundPlayer();
        public static Control KeysParent;

        public static bool ProcessLoaded = false;
        public static bool IsSpeaker { get; set; } = true;
        public static bool CanPressKeys { get; set; } = true;
        public static int Timeout { get; set; } = 1000;
        public static string Process { get; set; } = null;
        public static Font CheatFont = UI.GetDefaultFont(12.0f);
        public static int Padding = 5;

        [DllImport("User32.dll")]
        public static extern short GetAsyncKeyState(int vKey);

        public static void Play(UnmanagedMemoryStream stream)
        {
            if (!IsSpeaker)
            {
                return;
            }

            player.Stream = stream;
            player.Play();
        }

        public static void PlayAll(params UnmanagedMemoryStream[] streams)
        {
            if (!IsSpeaker)
            {
                return;
            }
            
            foreach (UnmanagedMemoryStream stream in streams)
            {
                player.Stream = stream;
                player.Play();
            }
        }

        public static void init()
        {
            mem.OpenProcess(Process);
            ProcessLoaded = true;
        }

        public static void exit()
        {
            mem.CloseProcess();
            ProcessLoaded = false;
        }

        public static void DeactivateKeys()
        {
            foreach(KeyStruct ks in Keys)
            {
                if(ks.Type == KeyType.UN_FREEZE)
                {
                    CodeStruct cs = GetCodeStructFromId(ks.CodeId);

                    if (cs.IsFrozen)
                    {
                        cs.IsFrozen = false;
                        Update(ks, cs);
                    }

                }
            }

            TrainerConfig.ActivateKey.IsActivated = false;
            TrainerConfig.UpdateActivateKey();
        }

        public static void RelocateKeyBy(ActivateKeyStruct aks, Control parent)
        {
            int parenthalf = parent.Width / 2;
            int ax = parenthalf - aks._control.Width / 2;
            int ay = aks._control.Location.Y;
            aks._control.Location = new Point(ax, ay);
        }

        public static void RelocateKeyByCentered(KeyStruct ks, Control parent)
        {
            int padd = TrainerConfig.Padding;
            int parenthalf = parent.Width / 2;
            int y = ks._control.Location.Y;

            if (ks.Type != KeyType.UN_FREEZE)
            {
                int full = ks._prefix.Width + padd;
                full += ks._control.Width + padd;
                full += ks._suffix.Width;

                if (ks.HelpTip != null)
                {
                    full += padd + ks._helptip.Width;
                }

                int startx = parenthalf - full / 2;

                ks._prefix.Location = new Point(startx, y);
                ks._control.Location = new Point(ks._prefix.Location.X + ks._prefix.Width + padd, y);
                ks._suffix.Location = new Point(ks._control.Location.X + ks._control.Width + padd, y);

                if (ks.HelpTip != null)
                {
                    ks._helptip.Location = new Point(ks._suffix.Location.X + ks._suffix.Width + padd, y + 2);
                }
            }
            else
            {
                // control
                int kcx = parenthalf - ks._control.Width / 2;
                ks._control.Location = new Point(kcx, y);
            }

        }

        public static void RelocateKeyBy(KeyStruct ks, Control parent, bool aligned = true)
        {
            if (!aligned)
            {
                RelocateKeyByCentered(ks, parent);
                return;
            }

            int parenthalf = parent.Width / 2;
            int y = ks._control.Location.Y;

            // control
            int kcx = parenthalf - ks._control.Width / 2;
            ks._control.Location = new Point(kcx, y);

            if (ks.Type != KeyType.UN_FREEZE)
            {
                int controlhalf = ks._control.Width / 2;

                // prefix
                int kpx = parenthalf - controlhalf - ks._prefix.Width - TrainerConfig.Padding;
                ks._prefix.Location = new Point(kpx, y);

                // suffix
                int ksx = parenthalf + controlhalf + TrainerConfig.Padding;
                ks._suffix.Location = new Point(ksx, y);
            }

            if (ks.HelpTip != null)
            {
                if (ks.Type != KeyType.UN_FREEZE)
                {
                    int khx = ks._suffix.Location.X + ks._suffix.Width + TrainerConfig.Padding;
                    ks._helptip.Location = new Point(khx, y + 2);
                }
                else
                {
                    int khx = ks._control.Location.X + ks._control.Width + TrainerConfig.Padding;
                    ks._helptip.Location = new Point(khx, y + 2);
                }
            }
        }

        public static void RelocateKeysBy(Control parent, bool aligned = true)
        {
            RelocateKeyBy(ActivateKey, parent);

            foreach(KeyStruct ks in Keys)
            {
                RelocateKeyBy(ks, parent, aligned);
            }
        }

        public static string BuildRemap()
        {
            StringBuilder sb = new StringBuilder();

            int index = 0;
            foreach (KeyStruct ks in Keys)
            {
                string ksx = $"{ks.Id},{ks.Code}";

                if(index != Keys.Count - 1)
                {
                    ksx += ";";
                }

                sb.Append(ksx);
                index++;
            }

            return sb.ToString();
        }

        public static void RemapUpdate(ActivateKeyStruct aks)
        {
            string text = GetFormattedText(aks);
            aks._control.Text = text;
            aks._control.Width = UI.GetTextWidth(text, CheatFont);
        }

        public static void RemapUpdate(KeyStruct ks)
        {
            SimpleTextStruct text = GetSimpleText(ks);

            if (ks.Type != KeyType.UN_FREEZE)
            {
                ks._prefix.Text = text.Prefix;
                ks._prefix.Width = UI.GetTextWidth(text.Prefix, CheatFont);
            }
            else
            {
                ks._control.Text = text.Prefix;
                ks._control.Width = UI.GetTextWidth(text.Prefix, CheatFont);
            }
        }

        public static void RemapAllUpdate()
        {
            string activate_remap = Properties.Settings.Default.ACTIVATE_REMAP;
            string remap = Properties.Settings.Default.REMAP;

            if (!String.IsNullOrEmpty(activate_remap))
            {
                ActivateKey.Code = (KeyCode)Enum.Parse(typeof(KeyCode), activate_remap);
                RemapUpdate(ActivateKey);
                RelocateKeyBy(ActivateKey, KeysParent);
            }

            if (!String.IsNullOrEmpty(remap))
            {
                if (!remap.Contains(";"))
                {
                    ParseRemapKey(remap);
                }

                string[] keycodes = remap.Split(';');

                foreach(string keycode in keycodes)
                {
                    ParseRemapKey(keycode);
                }
            }
        }

        private static void ParseRemapKey(string keycode)
        {
            string[] keycodeparts = keycode.Split(',');

            int id = int.Parse(keycodeparts[0]);
            KeyCode newCode = (KeyCode)Enum.Parse(typeof(KeyCode), keycodeparts[1]);

            KeyStruct ks = GetKeyStructFromId(id);
            ks.Code = newCode;
            RemapUpdate(ks);
            RelocateKeyByCentered(ks, KeysParent);
        }

        public static bool WasKeyPressed(int code)
        {
            return ((GetAsyncKeyState(code) >> 15) & 1) == 1;
        }

        public static bool WasKeyPressed(KeyStruct ks)
        {
            return WasKeyPressed((int)ks.Code);
        }

        public static bool WasKeyPressed(KeyCode kc)
        {
            return WasKeyPressed((int)kc);
        }

        public static void ResetKeys()
        {
            ActivateKey.IsPressed = false;
            foreach (KeyStruct ks in Keys)
            {
                ks.IsPressed = false;
            }
        }

        public static void CheckKeys()
        {
            ActivateKey.IsPressed = WasKeyPressed(ActivateKey.Code);
            foreach (KeyStruct ks in Keys)
            {
                ks.IsPressed = WasKeyPressed(ks);
            }
        }

        public static string GetFormattedText(ActivateKeyStruct aks)
        {
            return $"({aks.Code.ToString()}) {aks.Text}";
        }

        public static string GetFormattedText(KeyStruct ks)
        {
            CodeStruct cs = (CodeStruct)GetCodeStructFromId(ks.CodeId);
            return $"({ks.Code.ToString()}) {ks.Prefix} {cs.Name} {ks.Suffix}";
        }

        public static SimpleTextStruct GetSimpleText(KeyStruct ks, CodeStruct cs = null, Font font = null, bool withkeys = true)
        {
            if(font == null)
            {
                font = CheatFont;
            }

            if(cs == null)
            {
                cs = GetCodeStructFromId(ks.CodeId);
            }

            if (ks.Type == KeyType.ADD || ks.Type == KeyType.SET)
            {
                string prefix = ks.Prefix;

                if (String.IsNullOrEmpty(prefix))
                {
                    prefix = "Add";

                    if (ks.Type == KeyType.SET)
                    {
                        prefix = "Set";
                    }
                }

                return new SimpleTextStruct()
                {
                    Prefix = withkeys ? $"({ks.Code.ToString()}) {prefix}" : prefix,
                    Suffix = cs.Name
                };
            }
            else if (ks.Type == KeyType.UN_FREEZE)
            {
                return new SimpleTextStruct()
                {
                    Prefix = withkeys ? $"({ks.Code.ToString()}) Un/Freeze {cs.Name}" : $"Un/Freeze {cs.Name}"
                };
            }

            return new SimpleTextStruct();
        }

        public static KeyStruct GetKeyStructFromId(int id)
        {
            foreach (KeyStruct cs in Keys)
            {
                if (cs.Id == id)
                {
                    return (KeyStruct)cs;
                }
            }

            return null;
        }

        public static CodeStruct GetCodeStructFromId(int id)
        {
            foreach(CodeStruct cs in Codes)
            {
                if(cs.Id == id)
                {
                    return (CodeStruct)cs;
                }
            }

            return null;
        }

        public static string GetFinalAddress(CodeStruct cs, string suffix = ".exe")
        {
            if (cs.Address.Contains("base"))
            {
                return cs.Address.Replace("base", Process + suffix);
            }

            return cs.Address;
        }

        public static object GetValue(CodeStruct cs)
        {
            try
            {
                string address = GetFinalAddress(cs);

                switch (cs.Type)
                {
                    case "int":
                        return (int)mem.ReadInt(address);
                    case "double":
                        return (double)mem.ReadDouble(address);
                    default:
                        return null;
                }
            }
            catch (Exception e)
            {
                Play(Properties.Resources.error);
            }

            return null;
        }

        public static object AddValue(CodeStruct cs, object value)
        {
            try
            {
                switch (cs.Type)
                {
                    case "int":
                        return (int)mem.ReadInt(cs.Address) + Convert.ToInt32(value);
                    case "double":
                        return (double)mem.ReadDouble(cs.Address) + (double)value;
                    default:
                        return (int)0;
                }
            }
            catch (Exception e)
            {
                Play(Properties.Resources.error);
            }

            return (int)0;
        }

        public static void UpdateActivateKey()
        {
            if (ActivateKey.IsActivated)
            {
                Play(Properties.Resources.activated);
                ActivateKey._control.ForeColor = Color.Green;
            }
            else
            {
                Play(Properties.Resources.deactivated);
                ActivateKey._control.ForeColor = Color.Red;
            }
        }

        public static void Update(KeyStruct ks, CodeStruct cs = null)
        {
            if(ks.Type == KeyType.UN_FREEZE)
            {
                if(cs == null)
                {
                    cs = GetCodeStructFromId(ks.CodeId);
                }

                if (cs.IsFrozen)
                {
                    ks._control.ForeColor = Color.Green;
                }
                else
                {
                    ks._control.ForeColor = Color.Red;
                }
            }
        }

        public static void Execute(KeyStruct ks)
        {
            try
            {
                CodeStruct cs = TrainerConfig.GetCodeStructFromId(ks.CodeId);

                if (ks.Type == KeyType.ADD)
                {
                    Play(Properties.Resources.added);
                    object newvalue = AddValue(cs, ((NumericUpDown)ks._control).Value);
                    mem.WriteMemory(cs.Address, cs.Type, newvalue.ToString());
                }
                else if (ks.Type == KeyType.UN_FREEZE)
                {
                    cs.IsFrozen = !cs.IsFrozen;

                    if (cs.IsFrozen)
                    {
                        Play(Properties.Resources.frozen);
                        object value = TrainerConfig.GetValue(cs);
                        TrainerConfig.mem.FreezeValue(cs.Address, cs.Type, value.ToString());
                    }
                    else
                    {
                        Play(Properties.Resources.unfrozen);
                        TrainerConfig.mem.UnfreezeValue(cs.Address);
                    }
                }
                else if (ks.Type == KeyType.SET)
                {
                    Play(Properties.Resources.set);
                    decimal value = ((NumericUpDown)ks._control).Value;
                    mem.WriteMemory(cs.Address, cs.Type, value.ToString());
                }
            }
            catch (Exception e)
            {
                Play(Properties.Resources.error);
            }
        }

        public static bool IsAdmin()
        {
            return mem.IsAdmin();
        }
    }
}
