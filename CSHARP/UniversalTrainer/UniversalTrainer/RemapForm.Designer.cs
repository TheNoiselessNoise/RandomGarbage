
namespace UniversalTrainer
{
    partial class RemapForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(RemapForm));
            this.activate_key_combo = new System.Windows.Forms.ComboBox();
            this.cheat_combo = new System.Windows.Forms.ComboBox();
            this.cheat_key_combo = new System.Windows.Forms.ComboBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.close_btn = new System.Windows.Forms.Button();
            this.save_btn = new System.Windows.Forms.Button();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // activate_key_combo
            // 
            this.activate_key_combo.FormattingEnabled = true;
            this.activate_key_combo.Location = new System.Drawing.Point(12, 69);
            this.activate_key_combo.Name = "activate_key_combo";
            this.activate_key_combo.Size = new System.Drawing.Size(215, 21);
            this.activate_key_combo.TabIndex = 0;
            this.activate_key_combo.SelectedIndexChanged += new System.EventHandler(this.activate_key_combo_SelectedIndexChanged);
            // 
            // cheat_combo
            // 
            this.cheat_combo.FormattingEnabled = true;
            this.cheat_combo.Location = new System.Drawing.Point(12, 146);
            this.cheat_combo.Name = "cheat_combo";
            this.cheat_combo.Size = new System.Drawing.Size(215, 21);
            this.cheat_combo.TabIndex = 1;
            this.cheat_combo.SelectedIndexChanged += new System.EventHandler(this.cheat_combo_SelectedIndexChanged);
            // 
            // cheat_key_combo
            // 
            this.cheat_key_combo.FormattingEnabled = true;
            this.cheat_key_combo.Location = new System.Drawing.Point(12, 204);
            this.cheat_key_combo.Name = "cheat_key_combo";
            this.cheat_key_combo.Size = new System.Drawing.Size(215, 21);
            this.cheat_key_combo.TabIndex = 2;
            this.cheat_key_combo.SelectedIndexChanged += new System.EventHandler(this.cheat_key_combo_SelectedIndexChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label1.Location = new System.Drawing.Point(12, 48);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(138, 18);
            this.label1.TabIndex = 3;
            this.label1.Text = "Activate Trainer Key";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label2.Location = new System.Drawing.Point(12, 125);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(97, 18);
            this.label2.TabIndex = 4;
            this.label2.Text = "Trainer Cheat";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.label3.Location = new System.Drawing.Point(12, 183);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(126, 18);
            this.label3.TabIndex = 5;
            this.label3.Text = "Trainer Cheat Key";
            // 
            // close_btn
            // 
            this.close_btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.close_btn.Location = new System.Drawing.Point(12, 251);
            this.close_btn.Name = "close_btn";
            this.close_btn.Size = new System.Drawing.Size(108, 39);
            this.close_btn.TabIndex = 6;
            this.close_btn.Text = "Close";
            this.close_btn.UseVisualStyleBackColor = true;
            this.close_btn.Click += new System.EventHandler(this.close_btn_Click);
            // 
            // save_btn
            // 
            this.save_btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.save_btn.Location = new System.Drawing.Point(126, 251);
            this.save_btn.Name = "save_btn";
            this.save_btn.Size = new System.Drawing.Size(101, 39);
            this.save_btn.TabIndex = 7;
            this.save_btn.Text = "Save Config\r\n(for next start)";
            this.save_btn.UseVisualStyleBackColor = true;
            this.save_btn.Click += new System.EventHandler(this.save_btn_Click);
            // 
            // pictureBox1
            // 
            this.pictureBox1.Location = new System.Drawing.Point(203, 39);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(24, 24);
            this.pictureBox1.TabIndex = 8;
            this.pictureBox1.TabStop = false;
            this.pictureBox1.Click += new System.EventHandler(this.pictureBox1_Click);
            // 
            // RemapForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(239, 305);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.save_btn);
            this.Controls.Add(this.close_btn);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.cheat_key_combo);
            this.Controls.Add(this.cheat_combo);
            this.Controls.Add(this.activate_key_combo);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "RemapForm";
            this.Text = "Key Remapping";
            this.Load += new System.EventHandler(this.RemapForm_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ComboBox activate_key_combo;
        private System.Windows.Forms.ComboBox cheat_combo;
        private System.Windows.Forms.ComboBox cheat_key_combo;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button close_btn;
        private System.Windows.Forms.Button save_btn;
        private System.Windows.Forms.PictureBox pictureBox1;
    }
}