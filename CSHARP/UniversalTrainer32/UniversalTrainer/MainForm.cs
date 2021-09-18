using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Memory;
using System.IO;
using System.Diagnostics;
using System.Reflection;

namespace UniversalTrainer
{
    public partial class MainForm : Form
    {
        Timer globalTimer;
        Timer resetTimer;

        public MainForm()
        {
            UI.CLOSE_CROSS_IMAGES = new Bitmap[] { Properties.Resources.close_cross_0, Properties.Resources.close_cross_1, Properties.Resources.close_cross_2 };
            UI.MINIMIZE_LINE_IMAGES = new Bitmap[] { Properties.Resources.minimize_line_0, Properties.Resources.minimize_line_1, Properties.Resources.minimize_line_2 };

            AppDomain.CurrentDomain.AssemblyResolve += (sender, args) =>
            {
                string resourceName = new AssemblyName(args.Name).Name + ".dll";
                string resource = Array.Find(this.GetType().Assembly.GetManifestResourceNames(), element => element.EndsWith(resourceName));

                using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resource))
                {
                    Byte[] assemblyData = new Byte[stream.Length];
                    stream.Read(assemblyData, 0, assemblyData.Length);
                    return Assembly.Load(assemblyData);
                }
            };
            InitializeComponent();
        }

        private void Predefine()
        {
            TrainerConfig.ActivateKey = new ActivateKeyStruct(KeyCode.HOME);
            TrainerConfig.Codes = new List<CodeStruct>()
            {
                // ... CodeStructs
                // new CodeStruct(1, "Infinite Lives", "int", "base+00001BE0,944"),
                // new CodeStruct(2, "Infinite Shield", "int", "dll_file.dll+00001BE0,94C"),
            };
            TrainerConfig.Keys = new List<KeyStruct>()
            {
                // ... KeyStructs
                // new KeyStruct(1, 1, KeyType.UN_FREEZE, KeyCode.F1, value: 3, notprefix: true),
                // new KeyStruct(2, 2, KeyType.UN_FREEZE, KeyCode.F2, value: 3, notprefix: true),
            };

            int cheatcount = TrainerConfig.Codes.Count;
            TrainerConfig.Process = "<process_name>";
            TrainerConfig.Title = $"<your_game_name> Trainer +{cheatcount} (<version>)";
            TrainerConfig.Author = $"[by originally XYZT] © {DateTime.Now.Year}";
            TrainerConfig.AuthorSite = "https://xyzt.cz/";
            TrainerConfig.DonateLink = "https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=2X3XW8BFRG6EA&source=url";
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            if (!TrainerConfig.IsAdmin())
            {
                MessageBox.Show("Please, restart this trainer with Admin Privileges.", "Insufficent Privileges", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Application.Exit();
            }
            else
            {
                TrainerConfig.KeysParent = keypanel;
                Predefine();
                SetupKeyControls();
                ResizeForm();
                TrainerConfig.RelocateKeysBy(keypanel, false);
                TrainerConfig.RemapAllUpdate();

                UI.SetupFormBasic(this, false, 5);
                UI.SetupFormBasicBorder(this, 5);
                UI.DragMoveForm(this, pictureBox1);
                UI.SetupFormTitle(this, TrainerConfig.Title, 8, UI.GetDefaultFont(13.0f));
                UI.SetupFormFooter(this, TrainerConfig.Author, 8, UI.GetDefaultFont(10.0f));

                pictureBox1.Image = Properties.Resources.MainImage;
                pictureBox1.SizeMode = PictureBoxSizeMode.StretchImage;
                this.Icon = Properties.Resources.MainIcon;

                speaker_picturebox.Image = Properties.Resources.speakeron;
                speaker_picturebox.SizeMode = PictureBoxSizeMode.StretchImage;
                speaker_picturebox.Cursor = Cursors.Hand;
                UI.SetPictureBoxHoverEffects(speaker_picturebox, Color.Wheat, SystemColors.Control);
                speaker_picturebox.MouseClick += (s, ev) =>
                {
                    TrainerConfig.IsSpeaker = !TrainerConfig.IsSpeaker;
                    if (TrainerConfig.IsSpeaker)
                    {
                        speaker_picturebox.Image = Properties.Resources.speakeron;
                    }
                    else
                    {
                        speaker_picturebox.Image = Properties.Resources.speakeroff;
                    }
                };

                process_picturebox.Image = Properties.Resources.processoff;
                process_picturebox.SizeMode = PictureBoxSizeMode.StretchImage;

                remap_picturebox.Image = Properties.Resources.remap;
                remap_picturebox.SizeMode = PictureBoxSizeMode.StretchImage;
                remap_picturebox.Cursor = Cursors.Hand;
                UI.SetPictureBoxHoverEffects(remap_picturebox, Color.Wheat, SystemColors.Control);
                remap_picturebox.MouseClick += (s, ev) =>
                {
                    RemapForm rform = new RemapForm();
                    rform.AlignBy(TrainerConfig.KeysParent);
                    rform.ShowDialog(this);
                };

                xyzt_picturebox.Image = Properties.Resources.XYZTRoundBorder;
                xyzt_picturebox.SizeMode = PictureBoxSizeMode.StretchImage;
                xyzt_picturebox.Cursor = Cursors.Hand;
                UI.SetPictureBoxHoverEffects(xyzt_picturebox, Color.Wheat, SystemColors.Control);
                xyzt_picturebox.MouseClick += (s, ev) =>
                {
                    if (!String.IsNullOrEmpty(TrainerConfig.AuthorSite))
                    {
                        OpenWebpage(TrainerConfig.AuthorSite);
                    }
                };

                Font donateFont = UI.GetDefaultFont(12.0f, "Arial");
                my_donate.Text = TrainerConfig.lang.DONATE_ME;
                my_donate.Font = donateFont;
                my_donate.BackColor = Color.Wheat;
                my_donate.MouseEnter += (s, ev) =>
                {
                    my_donate.BackColor = Color.DodgerBlue;
                    my_donate.ForeColor = Color.White;
                };
                my_donate.MouseLeave += (s, ev) =>
                {
                    my_donate.BackColor = Color.Wheat;
                    my_donate.ForeColor = Color.Black;
                };

                globalTimer = new Timer();
                globalTimer.Interval = 16;
                globalTimer.Tick += GlobalTimer_Tick;
                globalTimer.Start();

                resetTimer = new Timer();
                resetTimer.Interval = TrainerConfig.Timeout;
                resetTimer.Tick += ResetTimer_Tick;
            }
        }

        private void ResizeForm()
        {
            Control c = TrainerConfig.Keys.Last()._control;
            keypanel.Height = c.Location.Y + c.Height + 29;
            this.Height = keypanel.Location.Y + c.Location.Y + c.Height + 35;
        }

        private void SetupKeyControls()
        {
            Font keyFont = TrainerConfig.CheatFont;

            string aktext = TrainerConfig.GetFormattedText(TrainerConfig.ActivateKey);
            Label aklabel = UI.SetupLabel(aktext, keyFont);
            aklabel.ForeColor = Color.Red;
            aklabel.Location = new Point(keypanel.Width / 2 - aklabel.Width / 2, 10);
            TrainerConfig.ActivateKey._control = aklabel;
            keypanel.Controls.Add(aklabel);
            aklabel.BringToFront();

            int x = 50;
            int y = 50;
            foreach (KeyStruct code in TrainerConfig.Keys)
            {
                SimpleTextStruct codeText = TrainerConfig.GetSimpleText(code, null);

                if (code.Type == KeyType.ADD || code.Type == KeyType.SET)
                {
                    Label prefixLabel = UI.SetupLabel(codeText.Prefix, keyFont);
                    prefixLabel.ForeColor = Color.Black;
                    prefixLabel.Location = new Point(x, y);
                    Label suffixLabel = UI.SetupLabel(codeText.Suffix, keyFont);
                    suffixLabel.ForeColor = Color.Black;
                    NumericUpDown input = new NumericUpDown();
                    input.Location = new Point(x + prefixLabel.Width + TrainerConfig.Padding, y);
                    suffixLabel.Location = new Point(input.Location.X + input.Width + TrainerConfig.Padding, y);
                    input.Minimum = 1;
                    input.Maximum = 999999;
                    input.Increment = 1;
                    input.DecimalPlaces = 0;

                    if(code.Value != null)
                    {
                        input.Value = Convert.ToDecimal(code.Value);
                    }
                    else
                    {
                        input.Value = 1;
                    }

                    input.TextAlign = HorizontalAlignment.Center;
                    code._control = input;
                    code._prefix = prefixLabel;
                    code._suffix = suffixLabel;
                    
                    keypanel.Controls.Add(prefixLabel);
                    keypanel.Controls.Add(input);
                    keypanel.Controls.Add(suffixLabel);
                    prefixLabel.BringToFront();
                    input.BringToFront();
                    suffixLabel.BringToFront();
                }
                else if(code.Type == KeyType.UN_FREEZE)
                {
                    Label label = UI.SetupLabel(codeText.Prefix, keyFont);
                    label.Location = new Point(x, y);
                    code._control = label;
                    keypanel.Controls.Add(label);
                    label.BringToFront();
                }

                if (code.HelpTip != null)
                {
                    PictureBox helppb = new PictureBox();
                    helppb.Width = 16;
                    helppb.Height = 16;
                    helppb.Image = Properties.Resources.qm;
                    helppb.SizeMode = PictureBoxSizeMode.StretchImage;
                    helppb.MouseHover += (s, e) =>
                    {
                        ToolTip tt = new ToolTip();
                        tt.SetToolTip(helppb, code.HelpTip);
                    };
                    helppb.Location = new Point(code._suffix.Location.X + code._suffix.Width + TrainerConfig.Padding, y + 2);
                    code._helptip = helppb;
                    keypanel.Controls.Add(helppb);
                    helppb.BringToFront();
                }

                y += 25;
            }
        }

        private void Reset()
        {
            globalTimer.Stop();
            resetTimer.Start();
        }

        private void ResetTimer_Tick(object sender, EventArgs e)
        {
            TrainerConfig.ResetKeys();
            TrainerConfig.CanPressKeys = true;
            resetTimer.Stop();
            globalTimer.Start();
        }

        private void GlobalTimer_Tick(object sender, EventArgs e)
        {
            if (!TrainerConfig.CanPressKeys)
            {
                return;
            }

            int pid = TrainerConfig.mem.GetProcIdFromName(TrainerConfig.Process);
            if (pid != 0)
            {
                process_picturebox.Image = Properties.Resources.processon;
                TrainerConfig.init();
            } 
            else
            {
                process_picturebox.Image = Properties.Resources.processoff;
            }

            if(pid == 0 && TrainerConfig.ProcessLoaded)
            {
                TrainerConfig.ProcessLoaded = false;
                TrainerConfig.DeactivateKeys(false);
            }

            if (!TrainerConfig.ProcessLoaded)
            {
                return;
            }

            TrainerConfig.CheckKeys();
            if(TrainerConfig.ActivateKey.IsPressed)
            {
                TrainerConfig.ActivateKey.IsActivated = !TrainerConfig.ActivateKey.IsActivated;
                TrainerConfig.CanPressKeys = false;
                TrainerConfig.UpdateActivateKey();

                if (!TrainerConfig.ActivateKey.IsActivated)
                {
                    TrainerConfig.DeactivateKeys(false);
                }
                Reset();
                return;
            }

            if (TrainerConfig.ActivateKey.IsActivated)
            {
                foreach (KeyStruct ks in TrainerConfig.Keys)
                {
                    if (ks.IsPressed)
                    {
                        TrainerConfig.CanPressKeys = false;
                        TrainerConfig.Execute(ks);
                        TrainerConfig.Update(ks);

                        Reset();
                        return;
                    }
                }
            }
        }

        private void OpenWebpage(string url)
        {
            Process process = new Process();
            ProcessStartInfo processInfo = new ProcessStartInfo();
            processInfo.WindowStyle = ProcessWindowStyle.Normal;
            processInfo.FileName = "explorer";
            processInfo.Arguments = $"\"{url}\"";
            process.StartInfo = processInfo;
            process.Start();
        }

        private void my_donate_Click(object sender, EventArgs e)
        {
            if (!String.IsNullOrEmpty(TrainerConfig.DonateLink))
            {
                OpenWebpage(TrainerConfig.DonateLink);
            }
        }
    }
}
