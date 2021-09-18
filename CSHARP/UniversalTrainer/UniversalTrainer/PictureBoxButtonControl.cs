using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace UniversalTrainer
{
    public class PictureBoxButton : System.Windows.Forms.PictureBox
    {
        private bool _isHovered = false;
        private bool _isDisabled = false;
        private bool _isHidden = false;
        private bool _isClicked = false;

        private System.Windows.Forms.Label _label = null;
        private System.Drawing.Bitmap[] imageArray = null;

        public PictureBoxButton()
        {
            Cursor = System.Windows.Forms.Cursors.Hand;
            SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
        }

        protected override void OnCreateControl()
        {
            _label = new System.Windows.Forms.Label();
            _label.Cursor = System.Windows.Forms.Cursors.Hand;
            _label.Location = new System.Drawing.Point(Location.X, Location.Y);
            _label.Width = Width;
            _label.Text = "DISABLED";
            _label.BackColor = System.Drawing.Color.DodgerBlue;
            _label.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            Parent.Controls.Add(_label);
            _label.BringToFront();
            _label.Hide();
            UI.MakeLabelFitText(ref _label, true, false);
        }

        public void SetImages(System.Drawing.Bitmap[] imgs)
        {
            imageArray = imgs;
        }

        public void ToggleHidden(bool? v = null)
        {
            if (v != null)
            {
                _isHidden = (bool)v;
            }
            else
            {
                _isHidden = !_isHidden;
            }

            if (isHidden())
            {
                _label.Hide();
                Hide();
            }
            else
            {
                if (isDisabled())
                {
                    _label.Show();
                }

                Show();
            }
            RePaint();
        }

        public void ToggleDisable(bool? v = null)
        {
            if (v != null)
            {
                _isDisabled = (bool)v;
            }
            else
            {
                _isDisabled = !_isDisabled;
            }
            RePaint(0);
        }

        public void ToggleHover(bool? v = null)
        {
            if (v != null)
            {
                _isHovered = (bool)v;
            }
            else
            {
                _isHovered = !_isHovered;
            }
            RePaint();
        }

        public void ToggleClicked(bool? v = null)
        {
            if (v != null)
            {
                _isClicked = (bool)v;
            }
            else
            {
                _isClicked = !_isClicked;
            }
            RePaint();
        }

        public void RePaint(int? x = null)
        {
            if (isDisabled())
            {
                _label.Show();
            }
            else
            {
                _label.Hide();
            }

            if (x != null)
            {
                Image = imageArray[(int)x];
                return;
            }

            int index = 0;

            if (isHovered())
            {
                index = 1;
            }

            if (isClicked())
            {
                index = 2;
            }

            Image = imageArray[index];
        }

        public bool isHidden()
        {
            return _isHidden;
        }

        public bool isDisabled()
        {
            return _isDisabled;
        }

        public bool isHovered()
        {
            return _isHovered;
        }

        public bool isClicked()
        {
            return _isClicked;
        }

        protected override void OnMouseDown(MouseEventArgs mevent)
        {
            if (!isDisabled())
            {
                ToggleClicked(true);
            }
        }

        protected override void OnMouseUp(MouseEventArgs mevent)
        {
            if (!isDisabled())
            {
                ToggleClicked(false);
            }
        }

        protected override void OnMouseEnter(EventArgs e)
        {
            if (!isDisabled())
            {
                ToggleHover(true);
            }
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            if (!isDisabled())
            {
                ToggleHover(false);
            }
        }
    }
}
