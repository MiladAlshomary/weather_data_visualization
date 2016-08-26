package vis_project;

import java.io.FileNotFoundException;
import java.io.FileReader;

import com.opencsv.CSVReader;

public class MainConteroller {
	
    public static void main(String[] args) {
    	
    }
    
    public static Object parseCsv(String file) {
    	try {
			CSVReader reader = new CSVReader(new FileReader(file));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	return null;
    }
}
