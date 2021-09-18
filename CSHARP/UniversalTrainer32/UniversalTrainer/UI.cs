using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Diagnostics;

namespace UniversalTrainer
{
    public class UI
    {
        public static Bitmap[] CLOSE_CROSS_IMAGES = null;
        public static Bitmap[] MINIMIZE_LINE_IMAGES = null;
        public static Dictionary<string, string[]> GAMES = null;

        public static void DragMoveForm(Form f, Control l = null)
        {
            f.MouseDown += (s, e) => { WindowHacks.DragMove(f.Handle); };
            if(l != null)
            {
                l.MouseDown += (s, e) => { WindowHacks.DragMove(f.Handle); };
            }
        }

        public static Label SetupLabel(string text, Font font = null)
        {
            if(font == null)
            {
                font = GetDefaultFont();
            }

            Label l = new Label();
            l.Font = font;
            l.Text = text;
            l.ForeColor = Color.Red;
            l.Location = new Point(10, 10);
            l.Width = UI.GetTextWidth(text, font);
            l.Height = UI.GetTextHeight(text, font);
            return l;
        }

        public static void SetupFormTitle(Form f, string title, int? padd = null, Font font = null)
        {
            if(padd == null)
            {
                padd = 0;
            }

            if(font == null)
            {
                font = GetDefaultFont();
            }

            Label titleLabel = new Label();
            titleLabel.Text = title;
            titleLabel.Font = font;
            titleLabel.Location = new Point((int)padd, (int)padd);
            titleLabel.Width = GetTextWidth(title, font);
            titleLabel.Height = GetTextHeight(title, font);
            f.Controls.Add(titleLabel);
            titleLabel.BringToFront();
        }

        public static void SetupFormFooter(Form f, string footer, int? padd = null, Font font = null)
        {
            if(padd == null)
            {
                padd = 0;
            }

            if(font == null)
            {
                font = GetDefaultFont();
            }

            int w = GetTextWidth(footer, font);
            int h = GetTextHeight(footer, font);
            Label footerLabel = new Label();
            footerLabel.Text = footer;
            footerLabel.Font = font;
            footerLabel.Location = new Point((int)(f.Width / 2 - w / 2), (int)(f.Height - padd - h));
            footerLabel.Width = w;
            footerLabel.Height = h;
            f.Controls.Add(footerLabel);
            footerLabel.BringToFront();
        }

        public static void SetupFormBasicBorder(Form f, int borderWidth = 1, Color? borderColor = null)
        {
            if (borderColor == null)
            {
                borderColor = Color.Black;
            }

            int fw = f.Width;
            int fh = f.Height;

            Panel tl = new Panel();
            tl.Location = new Point(0, 0);
            tl.Width = fw;
            tl.Height = borderWidth;
            tl.BackColor = (Color)borderColor;

            Panel bl = new Panel();
            bl.Location = new Point(0, borderWidth);
            bl.Width = borderWidth;
            bl.Height = fh - borderWidth;
            bl.BackColor = (Color)borderColor;

            Panel tr = new Panel();
            tr.Location = new Point(fw - borderWidth, borderWidth);
            tr.Width = borderWidth;
            tr.Height = fh - borderWidth;
            tr.BackColor = (Color)borderColor;

            Panel br = new Panel();
            br.Location = new Point(borderWidth, fh - borderWidth);
            br.Width = fw - (borderWidth * 2);
            br.Height = borderWidth;
            br.BackColor = (Color)borderColor;

            f.Controls.AddRange(new Control[] { tl, bl, tr, br });
        }

        public static void SetupFormBasic(Form f, bool close_form_not_app = false, int? padd = null, bool to_right = true, bool show_close = true, bool show_min = true, bool show_max = false)
        {
            if(padd == null)
            {
                if (to_right && f.Padding.Top > f.Padding.Right)
                {
                    padd = (int)f.Padding.Top;
                }
                else
                {
                    padd = (int)f.Padding.Right;
                }

                if(!to_right && f.Padding.Top > f.Padding.Left)
                {
                    padd = (int)f.Padding.Top;
                }
                else
                {
                    padd = (int)f.Padding.Left;
                }
            }

            int p = (int)padd;
            if (show_close)
            {
                PictureBox show_close_pb = new PictureBox();
                show_close_pb.Size = new Size(32, 32);
                if (to_right)
                {
                    show_close_pb.Location = new Point(f.Width - show_close_pb.Width - p, p);
                }
                else
                {
                    show_close_pb.Location = new Point(p, p);
                }

                if (close_form_not_app)
                {
                    SetupPictureBox(show_close_pb, CLOSE_CROSS_IMAGES, delegate { f.Close(); });
                }
                else
                {
                    SetupPictureBox(show_close_pb, CLOSE_CROSS_IMAGES, delegate { Application.Exit(); });
                }

                f.Controls.Add(show_close_pb);
                show_close_pb.BringToFront();
            }

            if (show_min)
            {
                PictureBox show_min_pb = new PictureBox();
                show_min_pb.Size = new Size(32, 32);
                if (to_right)
                {
                    show_min_pb.Location = new Point(f.Width - (show_min_pb.Width * 2) - (p * 2), p);
                }
                else
                {
                    show_min_pb.Location = new Point(show_min_pb.Width + (p * 2), p);
                }
                SetupPictureBox(show_min_pb, MINIMIZE_LINE_IMAGES, delegate { f.WindowState = FormWindowState.Minimized; });
                f.Controls.Add(show_min_pb);
                show_min_pb.BringToFront();
            }
        }

        public static void SetupPictureBox(PictureBox p, Bitmap[] images, MouseEventHandler f = null, Cursor c = null)
        {
            if(images.Length != 3)
            {
                return;
            }

            SetupPictureBox(p, images[0], images[1], images[2], f, c);
        }

        public static void SetupPictureBox(PictureBox p, Bitmap b1, Bitmap b2 = null, Bitmap b3 = null, MouseEventHandler f = null, Cursor c = null)
        {
            if(c == null)
            {
                c = Cursors.Hand;
            }

            if(b1 != null && b2 != null)
            {
                p.MouseEnter += delegate { p.Image = b2; };
                p.MouseLeave += delegate { p.Image = b1; };
            }

            if(b1 != null && b3 != null)
            {
                p.MouseDown += delegate { p.Image = b3; };
                p.MouseUp += delegate { p.Image = b1; };
            }

            if (f != null)
            {
                p.MouseClick += f;
            }

            p.Image = b1;
            p.Cursor = c;
        }

        public static void SetupSquareBorder(SquareBorder s, int borderWidth = 3, Color? borderColor = null, string labelText = null, Color? labelColor = null, Font labelFont = null)
        {
            if(borderColor == null)
            {
                borderColor = Color.Black;
            }

            if(labelText != null)
            {
                if(labelColor == null)
                {
                    labelColor = Color.Black;
                }

                if(labelFont == null)
                {
                    labelFont = GetDefaultFont();
                }

                s.SetLabel(labelText, labelFont, (Color)labelColor);
            }

            s.SetBorderWidth(borderWidth);
            s.SetBorderColor((Color)borderColor);
            s.RePaint();
        }

        public static void SetupBorderByPanels(Form f, Panel tl, Panel bl, Panel br, Panel tr, int borderWidth = 5, Color? borderColor = null)
        {
            if(borderColor == null)
            {
                borderColor = Color.Black;
            }

            int fw = f.Width;
            int fh = f.Height;

            tl.Location = new Point(0, 0);
            tl.Width = fw;
            tl.Height = borderWidth;
            tl.BackColor = (Color)borderColor;

            bl.Location = new Point(0, borderWidth);
            bl.Width = borderWidth;
            bl.Height = fh - borderWidth;
            bl.BackColor = (Color)borderColor;

            tr.Location = new Point(fw - borderWidth, borderWidth);
            tr.Width = borderWidth;
            tr.Height = fh - borderWidth;
            tr.BackColor = (Color)borderColor;

            br.Location = new Point(borderWidth, fh - borderWidth);
            br.Width = fw - (borderWidth * 2);
            br.Height = borderWidth;
            br.BackColor = (Color)borderColor;
        }

        public static void SetPictureBoxHoverEffects(PictureBox pb, Color first, Color second)
        {
            pb.MouseEnter += (s, e) => { pb.BackColor = first; };
            pb.MouseLeave += (s, e) => { pb.BackColor = second; };
        }

        public static Font GetDefaultFont(float size = 8.25f, string name = "Microsoft Sans Serif")
        {
            return new Font(name, size);
        }

        public static int GetTextWidth(string s, Font f = null)
        {
            if(f == null)
            {
                f = GetDefaultFont();
            }

            return TextRenderer.MeasureText(s, f).Width;
        }

        public static int GetTextHeight(string s, Font f = null)
        {
            if (f == null)
            {
                f = GetDefaultFont();
            }

            return TextRenderer.MeasureText(s, f).Height;
        }

        public static void MakeTextFitLabel(ref Label l)
        {
            while (l.Width < TextRenderer.MeasureText(l.Text, new Font(l.Font.FontFamily, l.Font.Size, l.Font.Style)).Width)
            {
                l.Font = new Font(l.Font.FontFamily, l.Font.Size - 0.5f, l.Font.Style);
            }
        }

        public static void MakeLabelFitText(ref Label l, bool height = true, bool width = true)
        {
            if (height)
            {
                while (l.Height > TextRenderer.MeasureText(l.Text, new Font(l.Font.FontFamily, l.Font.Size, l.Font.Style)).Height)
                {
                    l.Height -= 1;
                }
            }

            if (width)
            {
                while (l.Width > TextRenderer.MeasureText(l.Text, new Font(l.Font.FontFamily, l.Font.Size, l.Font.Style)).Width)
                {
                    l.Width -= 1;
                }
            }
        }
    }
}
