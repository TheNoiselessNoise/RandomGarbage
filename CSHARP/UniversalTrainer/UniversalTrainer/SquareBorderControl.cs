using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UniversalTrainer
{
    public class SquareBorder : System.Windows.Forms.Panel
    {
        private int borderWidth = 3;
        private System.Drawing.Color? borderColor = null;
        private System.Windows.Forms.Panel[] panels;

        private string _labelText = null;
        private System.Drawing.Color _labelColor;
        private System.Drawing.Font _labelFont = null;
        private System.Windows.Forms.Label _label = null;

        public SquareBorder()
        {
            _label = new System.Windows.Forms.Label();
            _label.AutoSize = true;

            panels = new System.Windows.Forms.Panel[]
            {
                new System.Windows.Forms.Panel(),
                new System.Windows.Forms.Panel(),
                new System.Windows.Forms.Panel(),
                new System.Windows.Forms.Panel()
            };

            borderColor = System.Drawing.Color.Black;
        }

        public void SetLabel(string labelText, System.Drawing.Font labelFont, System.Drawing.Color? labelColor)
        {
            _labelText = labelText;

            if (labelColor == null)
            {
                _labelColor = System.Drawing.Color.Black;
            }
            else
            {
                _labelColor = (System.Drawing.Color)labelColor;
            }

            if (labelFont == null)
            {
                _labelFont = UI.GetDefaultFont();
            }
            else
            {
                _labelFont = labelFont;
            }

            _label.ForeColor = _labelColor;
            _label.Font = _labelFont;
            _label.Text = _labelText;
            _label.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;

            int x = Convert.ToInt32(Location.X + (Width / 2) - Convert.ToInt32(_label.Width / 2));
            int y = Convert.ToInt32(Location.Y - (_label.Font.Size * 2));
            _label.Location = new System.Drawing.Point(x, y);
        }

        protected override void OnCreateControl()
        {
            foreach (System.Windows.Forms.Panel p in panels)
            {
                Controls.Add(p);
            }

            Parent.Controls.Add(_label);
            UI.SetupSquareBorder(this);
        }

        protected override void OnResize(EventArgs eventargs)
        {
            base.OnResize(eventargs);
            RePaint();
        }

        protected override void OnRegionChanged(EventArgs e)
        {
            base.OnRegionChanged(e);
            RePaint();
        }

        public void SetBorderWidth(int w)
        {
            borderWidth = w;
        }

        public void SetBorderColor(System.Drawing.Color c)
        {
            borderColor = (System.Drawing.Color)c;
        }

        public void RePaint()
        {
            int fw = Width;
            int fh = Height;

            panels[0].Location = new System.Drawing.Point(0, 0);
            //panels[0].Location = new System.Drawing.Point(Location.X, Location.Y);
            panels[0].Width = fw;
            panels[0].Height = borderWidth;
            panels[0].BackColor = (System.Drawing.Color)borderColor;

            panels[1].Location = new System.Drawing.Point(0, borderWidth);
            //panels[1].Location = new System.Drawing.Point(Location.X, Location.Y + borderWidth);
            panels[1].Width = borderWidth;
            panels[1].Height = fh - borderWidth;
            panels[1].BackColor = (System.Drawing.Color)borderColor;

            panels[2].Location = new System.Drawing.Point(fw - borderWidth, borderWidth);
            //panels[2].Location = new System.Drawing.Point(Location.X + (fw - borderWidth), Location.Y + borderWidth);
            panels[2].Width = borderWidth;
            panels[2].Height = fh - borderWidth;
            panels[2].BackColor = (System.Drawing.Color)borderColor;

            panels[3].Location = new System.Drawing.Point(borderWidth, fh - borderWidth);
            //panels[3].Location = new System.Drawing.Point(Location.X + borderWidth, Location.Y + (fh - borderWidth));
            panels[3].Width = fw - (borderWidth * 2);
            panels[3].Height = borderWidth;
            panels[3].BackColor = (System.Drawing.Color)borderColor;
        }
    }
}
