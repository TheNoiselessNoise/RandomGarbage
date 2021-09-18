
namespace UniversalTrainer
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.keypanel = new System.Windows.Forms.Panel();
            this.infopanel = new System.Windows.Forms.Panel();
            this.my_donate = new System.Windows.Forms.Button();
            this.xyzt_picturebox = new System.Windows.Forms.PictureBox();
            this.remap_picturebox = new System.Windows.Forms.PictureBox();
            this.process_picturebox = new System.Windows.Forms.PictureBox();
            this.speaker_picturebox = new System.Windows.Forms.PictureBox();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.infopanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.xyzt_picturebox)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.remap_picturebox)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.process_picturebox)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.speaker_picturebox)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // keypanel
            // 
            this.keypanel.AutoScroll = true;
            this.keypanel.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.keypanel.Location = new System.Drawing.Point(6, 263);
            this.keypanel.Name = "keypanel";
            this.keypanel.Size = new System.Drawing.Size(390, 384);
            this.keypanel.TabIndex = 2;
            // 
            // infopanel
            // 
            this.infopanel.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.infopanel.Controls.Add(this.xyzt_picturebox);
            this.infopanel.Controls.Add(this.my_donate);
            this.infopanel.Controls.Add(this.remap_picturebox);
            this.infopanel.Controls.Add(this.process_picturebox);
            this.infopanel.Controls.Add(this.speaker_picturebox);
            this.infopanel.Location = new System.Drawing.Point(6, 186);
            this.infopanel.Name = "infopanel";
            this.infopanel.Size = new System.Drawing.Size(390, 72);
            this.infopanel.TabIndex = 3;
            // 
            // my_donate
            // 
            this.my_donate.Cursor = System.Windows.Forms.Cursors.Hand;
            this.my_donate.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.my_donate.Location = new System.Drawing.Point(283, 3);
            this.my_donate.Name = "my_donate";
            this.my_donate.Size = new System.Drawing.Size(102, 64);
            this.my_donate.TabIndex = 4;
            this.my_donate.Text = "DONATE ^_^";
            this.my_donate.UseVisualStyleBackColor = true;
            this.my_donate.Click += new System.EventHandler(this.my_donate_Click);
            // 
            // xyzt_picturebox
            // 
            this.xyzt_picturebox.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.xyzt_picturebox.Location = new System.Drawing.Point(213, 3);
            this.xyzt_picturebox.Name = "xyzt_picturebox";
            this.xyzt_picturebox.Size = new System.Drawing.Size(64, 64);
            this.xyzt_picturebox.TabIndex = 5;
            this.xyzt_picturebox.TabStop = false;
            // 
            // remap_picturebox
            // 
            this.remap_picturebox.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.remap_picturebox.Location = new System.Drawing.Point(73, 3);
            this.remap_picturebox.Name = "remap_picturebox";
            this.remap_picturebox.Size = new System.Drawing.Size(64, 64);
            this.remap_picturebox.TabIndex = 2;
            this.remap_picturebox.TabStop = false;
            // 
            // process_picturebox
            // 
            this.process_picturebox.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.process_picturebox.Location = new System.Drawing.Point(143, 3);
            this.process_picturebox.Name = "process_picturebox";
            this.process_picturebox.Size = new System.Drawing.Size(64, 64);
            this.process_picturebox.TabIndex = 1;
            this.process_picturebox.TabStop = false;
            // 
            // speaker_picturebox
            // 
            this.speaker_picturebox.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.speaker_picturebox.Location = new System.Drawing.Point(3, 3);
            this.speaker_picturebox.Name = "speaker_picturebox";
            this.speaker_picturebox.Size = new System.Drawing.Size(64, 64);
            this.speaker_picturebox.TabIndex = 0;
            this.speaker_picturebox.TabStop = false;
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = global::UniversalTrainer.Properties.Resources.MainImage;
            this.pictureBox1.Location = new System.Drawing.Point(6, 38);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(390, 142);
            this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pictureBox1.TabIndex = 0;
            this.pictureBox1.TabStop = false;
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(402, 653);
            this.Controls.Add(this.infopanel);
            this.Controls.Add(this.keypanel);
            this.Controls.Add(this.pictureBox1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "MainForm";
            this.Padding = new System.Windows.Forms.Padding(3);
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.infopanel.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.xyzt_picturebox)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.remap_picturebox)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.process_picturebox)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.speaker_picturebox)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Panel keypanel;
        private System.Windows.Forms.Panel infopanel;
        private System.Windows.Forms.PictureBox speaker_picturebox;
        private System.Windows.Forms.PictureBox process_picturebox;
        private System.Windows.Forms.PictureBox remap_picturebox;
        private System.Windows.Forms.Button my_donate;
        private System.Windows.Forms.PictureBox xyzt_picturebox;
    }
}

