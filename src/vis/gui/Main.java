package vis.gui;

import java.awt.BorderLayout;
import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.File;
import java.net.URL;
import java.util.List;
import java.util.Map;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;

import com.teamdev.jxbrowser.chromium.Browser;
import com.teamdev.jxbrowser.chromium.swing.BrowserView;

import javax.swing.JToolBar;
import javax.swing.JSlider;
import javax.swing.JButton;
import javax.swing.JFileChooser;

import parser.CSVParser;

public class Main extends JFrame {

	private JPanel contentPane;
	private final JFileChooser fc = new JFileChooser();
	
	static private List<Map<String, String>> data;
	
	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
		    		// Read file
					data = CSVParser.getData( CSVParser.readFileFromResources("data.csv") );
					
					Main frame = new Main();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public Main() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		contentPane.setLayout(new BorderLayout(0, 0));
		setContentPane(contentPane);
		

		JToolBar toolBar = new JToolBar();
		contentPane.add(toolBar, BorderLayout.NORTH);
		
		JSlider slider = new JSlider();
		toolBar.add(slider);
		
		JButton load = new JButton("Load File");
		toolBar.add(load);
		
		// Load CSV button
		load.addActionListener(new ActionListener()
		{
		  public void actionPerformed(ActionEvent e)
		  {
			  if (e.getSource() == load) {
			        int returnVal = fc.showOpenDialog(contentPane);
			        
			        // If user approves the select file
			        if (returnVal == JFileChooser.APPROVE_OPTION) {
			            // Reload the user-selected CSV file
						data = CSVParser.getData(fc.getSelectedFile());
			        }
			   }
		  }
		});
		
		Browser browser = new Browser();
		browser.setLoadHandler(null);
		
		URL mapURL = getClass().getClassLoader().getResource("map.html");
    	//browser.loadURL(mapURL);
		BrowserView bView = new BrowserView(browser);
		
		
		JPanel panel = new JPanel(new BorderLayout());
    	panel.add(bView , BorderLayout.CENTER);
    	contentPane.add(panel, BorderLayout.CENTER);
    	
	}

}
