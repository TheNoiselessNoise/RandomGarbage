using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace UniversalTrainer
{
    public partial class RemapForm : Form
    {
        private bool IsAllLoaded = false;
        private Control AlignControl;

        public RemapForm()
        {
            InitializeComponent();
        }

        private void RemapForm_Load(object sender, EventArgs e)
        {
            UI.SetupFormBasic(this, true, 5, true, true, false);
            UI.SetupFormTitle(this, "Key Remapping", 8, UI.GetDefaultFont(14.0f));
            UI.SetupFormBasicBorder(this, 5);
            UI.DragMoveForm(this, this.Controls[0]);

            pictureBox1.Image = Properties.Resources.qm;
            pictureBox1.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox1.Cursor = Cursors.Hand;

            close_btn.Cursor = Cursors.Hand;
            close_btn.MouseEnter += (s, ev) =>
            {
                close_btn.BackColor = Color.FromArgb(16, 21, 155);
                close_btn.ForeColor = Color.White;
            };
            close_btn.MouseLeave += (s, ev) =>
            {
                close_btn.BackColor = SystemColors.Control;
                close_btn.ForeColor = Color.Black;
            };
            save_btn.Cursor = Cursors.Hand;
            save_btn.MouseEnter += (s, ev) =>
            {
                save_btn.BackColor = Color.FromArgb(16, 21, 155);
                save_btn.ForeColor = Color.White;
            };
            save_btn.MouseLeave += (s, ev) =>
            {
                save_btn.BackColor = SystemColors.Control;
                save_btn.ForeColor = Color.Black;
            };

            LoadComboValues();
            SelectDefaultValues();
            IsAllLoaded = true;
        }

        public void AlignBy(Control c)
        {
            AlignControl = c;
        }

        private void LoadComboValues()
        {
            List<string> activatekeylist = Enum.GetValues(typeof(KeyCode)).Cast<KeyCode>().Select(f => f.ToString()).ToList();
            activate_key_combo.DataSource = activatekeylist;
            List<string> keylist = new List<string>(activatekeylist);
            cheat_key_combo.DataSource = keylist;

            List<string> cheatlist = new List<string>();
            foreach (KeyStruct ks in TrainerConfig.Keys)
            {
                SimpleTextStruct sts = TrainerConfig.GetSimpleText(ks, null, null, false);
                cheatlist.Add($"{sts.Prefix} {sts.Suffix}");
            }
            cheat_combo.DataSource = cheatlist;
        }

        private void SelectDefaultValues()
        {
            activate_key_combo.SelectedItem = TrainerConfig.ActivateKey.Code.ToString();
            cheat_combo.SelectedIndex = 0;
            cheat_key_combo.SelectedItem = TrainerConfig.Keys[0].Code.ToString();
        }

        private void close_btn_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void save_btn_Click(object sender, EventArgs e)
        {
            Properties.Settings.Default.ACTIVATE_REMAP = (string)activate_key_combo.SelectedItem;
            Properties.Settings.Default.REMAP = TrainerConfig.BuildRemap();
            Properties.Settings.Default.Save();
            this.Close();
        }

        private void pictureBox1_Click(object sender, EventArgs e)
        {
            string msg = "DIGIT0-9 -> Digits keys under the Function keys (F1-F12)\n" +
                         "N0-9 -> Numeric keys on NumPad";
            MessageBox.Show(msg, "Keys info");
        }

        private void activate_key_combo_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (IsAllLoaded)
            {
                string selected = (string)activate_key_combo.SelectedItem;
                KeyCode newCode = (KeyCode)Enum.Parse(typeof(KeyCode), selected);
                TrainerConfig.ActivateKey.Code = newCode;
                TrainerConfig.RemapUpdate(TrainerConfig.ActivateKey);
                TrainerConfig.RelocateKeyBy(TrainerConfig.ActivateKey, AlignControl);
            }
        }

        private void cheat_combo_SelectedIndexChanged(object sender, EventArgs e)
        {
            cheat_key_combo.SelectedItem = TrainerConfig.Keys[cheat_combo.SelectedIndex].Code.ToString();
        }

        private void cheat_key_combo_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (IsAllLoaded)
            {
                string selected = (string)cheat_key_combo.SelectedItem;
                KeyCode newCode = (KeyCode)Enum.Parse(typeof(KeyCode), selected);
                TrainerConfig.Keys[cheat_combo.SelectedIndex].Code = newCode;
                TrainerConfig.RemapUpdate(TrainerConfig.Keys[cheat_combo.SelectedIndex]);
                TrainerConfig.RelocateKeyByCentered(TrainerConfig.Keys[cheat_combo.SelectedIndex], AlignControl);
            }
        }
    }
}
