using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;

namespace Dean.Edwards
{
    public class Packers
    {
        private ArrayList src_files = new ArrayList();
        private ArrayList des_files = new ArrayList();
        private string src_dir;
        private string des_dir;

        public Packers()
		{
		}

        public void pack_Start(string src, string des)
        {
            this.set_Dirs(src, des);
            this.get_SrcFiles();
            this.set_DesFiles();
            for ( int i=0; i<this.src_files.Count; ++i )
            {
                string cstr = this.load_File(this.src_files[i].ToString());
                string pstr = this.pack_String(cstr);
                this.save_File(this.des_files[i].ToString(), pstr);
            }
        }

        private void set_Dirs(string srcdir, string desdir)
        {
            this.src_dir = this.completeDir(srcdir);
            this.des_dir = this.completeDir(desdir);
        }

        private void get_SrcFiles()
        {
            this.src_files.Clear();
            this.findFile(this.src_dir);
        }

        private void set_DesFiles()
        {
            this.des_files.Clear();
            for ( int i=0; i<this.src_files.Count; ++i )
            {
                string src = this.src_files[i].ToString();
                string filename = src.Substring(this.src_dir.Length);
                this.des_files.Add(this.des_dir + filename);
            }
        }

        private string load_File(string filename)
        {
            TextReader trd = new StreamReader(filename);
            string content = trd.ReadToEnd();
            trd.Close();
            Regex regex = new Regex("([^\r])(\n+)");
            return regex.Replace(content, new MatchEvaluator(changeUnixLineEndings));
        }

        private string pack_String(string contectstring)
        {
            Boolean fastDecode = true;
            Boolean specialChars = false;
            ECMAScriptPacker p = new ECMAScriptPacker(ECMAScriptPacker.PackerEncoding.Normal, fastDecode, specialChars);
            return p.Pack(contectstring).Replace("\n", "\r\n");
        }

        private void save_File(string filename, string packstring)
        {
            TextWriter twr = new StreamWriter(filename);
            twr.Write(packstring);
            twr.Close();
        }

        private string changeUnixLineEndings(Match match)
        {
            return match.Value.Replace("\n", "\r\n");
        }

        private void findFile(string dir)
        {
            DirectoryInfo Dir = new DirectoryInfo(dir);
            try
            {
                foreach (DirectoryInfo d in Dir.GetDirectories())
                {
                    this.findFile(Dir + d.ToString() + "/");
                }
                foreach (FileInfo f in Dir.GetFiles("*.js"))
                {
                    this.src_files.Add(Dir + f.ToString());
                }
            }
            catch
            {
                this.src_files.Add(dir);
            }
        }

        private string completeDir(string dir)
        {
            if (dir.Length >= 3 && dir.Substring(dir.Length - 3).ToLower().CompareTo(".js") == 0)
            {
            }
            else if (dir.Length >= 1 && dir.Substring(dir.Length - 1).CompareTo("/") == 0)
            {
            }
            else
            {
                dir += "/";
            }
            return dir;
        }
    }

	/// <summary>
	/// Summary description for Form1.
	/// </summary>
	public class Packer : System.Windows.Forms.Form
	{
        private System.Windows.Forms.TextBox tbSource;
        private System.Windows.Forms.TextBox tbResult;
        private System.Windows.Forms.Button pack;
        private System.Windows.Forms.ComboBox Encoding;
        private System.Windows.Forms.CheckBox fastDecode;
        private System.Windows.Forms.CheckBox specialChars;
        private System.Windows.Forms.LinkLabel llPaste;
        private System.Windows.Forms.LinkLabel llCopy;
        private System.Windows.Forms.Button bLoad;
        private System.Windows.Forms.Button bSave;
        private System.Windows.Forms.Button bClear;
        private System.Windows.Forms.OpenFileDialog ofdSource;
        private System.Windows.Forms.SaveFileDialog sfdResult;
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.Container components = null;

		public Packer()
		{
			//
			// Required for Windows Form Designer support
			//
			InitializeComponent();

			//
			// TODO: Add any constructor code after InitializeComponent call
			//
		}

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		protected override void Dispose( bool disposing )
		{
			if( disposing )
			{
				if (components != null) 
				{
					components.Dispose();
				}
			}
			base.Dispose( disposing );
		}

		#region Windows Form Designer generated code
		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
            this.tbSource = new System.Windows.Forms.TextBox();
            this.tbResult = new System.Windows.Forms.TextBox();
            this.pack = new System.Windows.Forms.Button();
            this.Encoding = new System.Windows.Forms.ComboBox();
            this.fastDecode = new System.Windows.Forms.CheckBox();
            this.specialChars = new System.Windows.Forms.CheckBox();
            this.llPaste = new System.Windows.Forms.LinkLabel();
            this.llCopy = new System.Windows.Forms.LinkLabel();
            this.bLoad = new System.Windows.Forms.Button();
            this.bSave = new System.Windows.Forms.Button();
            this.bClear = new System.Windows.Forms.Button();
            this.ofdSource = new System.Windows.Forms.OpenFileDialog();
            this.sfdResult = new System.Windows.Forms.SaveFileDialog();
            this.SuspendLayout();
            // 
            // tbSource
            // 
            this.tbSource.AcceptsReturn = true;
            this.tbSource.AcceptsTab = true;
            this.tbSource.AllowDrop = true;
            this.tbSource.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.tbSource.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.tbSource.Font = new System.Drawing.Font("Courier New", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbSource.Location = new System.Drawing.Point(10, 26);
            this.tbSource.Multiline = true;
            this.tbSource.Name = "tbSource";
            this.tbSource.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.tbSource.Size = new System.Drawing.Size(774, 241);
            this.tbSource.TabIndex = 0;
            // 
            // tbResult
            // 
            this.tbResult.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.tbResult.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.tbResult.Font = new System.Drawing.Font("Courier New", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tbResult.Location = new System.Drawing.Point(10, 249);
            this.tbResult.Multiline = true;
            this.tbResult.Name = "tbResult";
            this.tbResult.ReadOnly = true;
            this.tbResult.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.tbResult.Size = new System.Drawing.Size(774, 224);
            this.tbResult.TabIndex = 0;
            // 
            // pack
            // 
            this.pack.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.pack.BackColor = System.Drawing.Color.LightSkyBlue;
            this.pack.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.pack.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.pack.Location = new System.Drawing.Point(10, 484);
            this.pack.Name = "pack";
            this.pack.Size = new System.Drawing.Size(90, 24);
            this.pack.TabIndex = 1;
            this.pack.Text = "&Pack";
            this.pack.UseVisualStyleBackColor = false;
            this.pack.Click += new System.EventHandler(this.pack_Click);
            // 
            // Encoding
            // 
            this.Encoding.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.Encoding.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.Encoding.Location = new System.Drawing.Point(640, 484);
            this.Encoding.Name = "Encoding";
            this.Encoding.Size = new System.Drawing.Size(145, 20);
            this.Encoding.TabIndex = 2;
            this.Encoding.SelectedIndexChanged += new System.EventHandler(this.Encoding_SelectedIndexChanged);
            // 
            // fastDecode
            // 
            this.fastDecode.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.fastDecode.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.fastDecode.Checked = true;
            this.fastDecode.CheckState = System.Windows.Forms.CheckState.Checked;
            this.fastDecode.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.fastDecode.Location = new System.Drawing.Point(659, 510);
            this.fastDecode.Name = "fastDecode";
            this.fastDecode.Size = new System.Drawing.Size(125, 25);
            this.fastDecode.TabIndex = 3;
            this.fastDecode.Text = "Fast Decode:";
            this.fastDecode.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // specialChars
            // 
            this.specialChars.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.specialChars.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.specialChars.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.specialChars.Location = new System.Drawing.Point(621, 535);
            this.specialChars.Name = "specialChars";
            this.specialChars.Size = new System.Drawing.Size(163, 26);
            this.specialChars.TabIndex = 3;
            this.specialChars.Text = "Special Characters:";
            this.specialChars.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // llPaste
            // 
            this.llPaste.Location = new System.Drawing.Point(10, 9);
            this.llPaste.Name = "llPaste";
            this.llPaste.Size = new System.Drawing.Size(67, 17);
            this.llPaste.TabIndex = 4;
            this.llPaste.TabStop = true;
            this.llPaste.Text = "Paste:";
            this.llPaste.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.llPaste_LinkClicked);
            // 
            // llCopy
            // 
            this.llCopy.Location = new System.Drawing.Point(10, 276);
            this.llCopy.Name = "llCopy";
            this.llCopy.Size = new System.Drawing.Size(67, 17);
            this.llCopy.TabIndex = 4;
            this.llCopy.TabStop = true;
            this.llCopy.Text = "Copy:";
            this.llCopy.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.llCopy_LinkClicked);
            // 
            // bLoad
            // 
            this.bLoad.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.bLoad.BackColor = System.Drawing.Color.LightSkyBlue;
            this.bLoad.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.bLoad.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.bLoad.Location = new System.Drawing.Point(106, 484);
            this.bLoad.Name = "bLoad";
            this.bLoad.Size = new System.Drawing.Size(90, 24);
            this.bLoad.TabIndex = 1;
            this.bLoad.Text = "&Load";
            this.bLoad.UseVisualStyleBackColor = false;
            this.bLoad.Click += new System.EventHandler(this.bLoad_Click);
            // 
            // bSave
            // 
            this.bSave.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.bSave.BackColor = System.Drawing.Color.LightSkyBlue;
            this.bSave.Enabled = false;
            this.bSave.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.bSave.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.bSave.Location = new System.Drawing.Point(202, 484);
            this.bSave.Name = "bSave";
            this.bSave.Size = new System.Drawing.Size(90, 24);
            this.bSave.TabIndex = 1;
            this.bSave.Text = "&Save";
            this.bSave.UseVisualStyleBackColor = false;
            this.bSave.Click += new System.EventHandler(this.bSave_Click);
            // 
            // bClear
            // 
            this.bClear.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.bClear.BackColor = System.Drawing.Color.LightSkyBlue;
            this.bClear.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.bClear.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.bClear.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.bClear.Location = new System.Drawing.Point(298, 484);
            this.bClear.Name = "bClear";
            this.bClear.Size = new System.Drawing.Size(90, 24);
            this.bClear.TabIndex = 1;
            this.bClear.Text = "&Clear";
            this.bClear.UseVisualStyleBackColor = false;
            this.bClear.Click += new System.EventHandler(this.bClear_Click);
            // 
            // ofdSource
            // 
            this.ofdSource.DefaultExt = "js";
            this.ofdSource.Filter = "ECMAScript Files|*.js|All files|*.*";
            this.ofdSource.Title = "Choose a file";
            // 
            // sfdResult
            // 
            this.sfdResult.DefaultExt = "js";
            this.sfdResult.Filter = "ECMAScript Files|*.js|All files|*.*";
            // 
            // Packer
            // 
            this.AcceptButton = this.pack;
            this.AutoScaleBaseSize = new System.Drawing.Size(6, 14);
            this.CancelButton = this.bClear;
            this.ClientSize = new System.Drawing.Size(794, 568);
            this.Controls.Add(this.llPaste);
            this.Controls.Add(this.fastDecode);
            this.Controls.Add(this.Encoding);
            this.Controls.Add(this.pack);
            this.Controls.Add(this.tbSource);
            this.Controls.Add(this.tbResult);
            this.Controls.Add(this.specialChars);
            this.Controls.Add(this.llCopy);
            this.Controls.Add(this.bLoad);
            this.Controls.Add(this.bSave);
            this.Controls.Add(this.bClear);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "Packer";
            this.Text = "Packer";
            this.Load += new System.EventHandler(this.Packer_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }
		#endregion

		/// <summary>
		/// The main entry point for the application.
		/// </summary>
		[STAThread]
        static void Main(string[] args) 
		{
            if ( args.Length != 2 ) 
            {
                Application.Run(new Packer());
            }
            else 
            {
                System.Console.WriteLine("start converting ....");
                Packers packers = new Packers();
                packers.pack_Start(args[0], args[1]);
                System.Console.WriteLine("convert ok!");
            }
		}

        private void pack_Click(object sender, System.EventArgs e)
        {
            ECMAScriptPacker p = new ECMAScriptPacker((ECMAScriptPacker.PackerEncoding) Encoding.SelectedItem, fastDecode.Checked, specialChars.Checked);
            tbResult.Text = p.Pack(tbSource.Text).Replace("\n", "\r\n");
            bSave.Enabled = true;
        }

        private void Packer_Load(object sender, System.EventArgs e)
        {
            Encoding.Items.Add(ECMAScriptPacker.PackerEncoding.None);
            Encoding.Items.Add(ECMAScriptPacker.PackerEncoding.Numeric);
            Encoding.Items.Add(ECMAScriptPacker.PackerEncoding.Mid);
            Encoding.Items.Add(ECMAScriptPacker.PackerEncoding.Normal);
            Encoding.Items.Add(ECMAScriptPacker.PackerEncoding.HighAscii);
            Encoding.SelectedItem = ECMAScriptPacker.PackerEncoding.Normal;
        }

        private void Encoding_SelectedIndexChanged(object sender, System.EventArgs e)
        {
            fastDecode.Enabled = ((ECMAScriptPacker.PackerEncoding)Encoding.SelectedItem != ECMAScriptPacker.PackerEncoding.None);
        }

        private void llPaste_LinkClicked(object sender, System.Windows.Forms.LinkLabelLinkClickedEventArgs e)
        {
            tbSource.Text = (string)Clipboard.GetDataObject().GetData(typeof(string));
        }

        private void llCopy_LinkClicked(object sender, System.Windows.Forms.LinkLabelLinkClickedEventArgs e)
        {
            Clipboard.SetDataObject(tbResult.Text, true);
        }

        private void bClear_Click(object sender, System.EventArgs e)
        {
            tbResult.Text = tbSource.Text = string.Empty;
            bSave.Enabled = false;
        }

        private void bLoad_Click(object sender, System.EventArgs e)
        {
            DialogResult r = ofdSource.ShowDialog(this);
            if (r == DialogResult.OK)
            {
                Stream s = ofdSource.OpenFile();
                TextReader rd = new StreamReader(s);
                string content = rd.ReadToEnd();
                rd.Close();
                s.Close();
                Regex regex = new Regex("([^\r])(\n+)");
                tbSource.Text = regex.Replace(content, new MatchEvaluator(changeUnixLineEndings));
            }
        }

        private string changeUnixLineEndings(Match match)
        {
            return match.Value.Replace("\n", "\r\n");
        }

        private void bSave_Click(object sender, System.EventArgs e)
        {
            DialogResult r = sfdResult.ShowDialog(this);
            if (r == DialogResult.OK)
            {
                Stream s = sfdResult.OpenFile();
                TextWriter rd = new StreamWriter(s);
                rd.Write(tbResult.Text);
                rd.Close();
                s.Close();
            }
        }
	}
}
