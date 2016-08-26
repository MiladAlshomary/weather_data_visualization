package parser;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.opencsv.CSVReader;

public class CSVParser {
	public final String STATION_NAME = "Stationname";
	public final String DATE = "Date";
	public final String LAT = "Latitude";
	public final String LONG = "Longitude";
	public final String STATION_HEIGHT = "StationHeight";
	public final String UNIT_OF_HEIGHT = "UnitOfHeight";
	public final String GEO_QUALITY_LEVEL = "GeoQualityLevel";
	public final String AIR_TEMPERATURE = "air temperature";
	public final String UNIT_OF_TEMP = "UnitOfTemp";
	public final String TEMP_GROUND_QUALITY_LEVEL = "Temp. Ground QualityLevel";
	
	public static File readFileFromResources(String filename){
		ClassLoader classLoader = ClassLoader.getSystemClassLoader();
		URL url = classLoader.getResource(filename);
		return new File( url.getFile() );
	}
	
	/*
	 * Get data from CSV file
	 */
    public static List<Map<String, String>> getData(File csvFile) {
		List<Map<String, String>> data = new ArrayList<Map<String, String>>();
		
    	try {    		
			@SuppressWarnings("resource")
			// Read the file with a specific separator
			CSVReader reader = new CSVReader(new FileReader(csvFile),';');
			
			String[] columnNames = null;
			int columnTotals = 0; // total columns in the dataset
			
			// Iterate over the data with respect ot the separator
			Iterator<String[]> i = reader.iterator();
			
			// Loop over file
			while (i.hasNext()){
				// Get next row
				String[] row = i.next();
				
				// First row in data are the column names
				if (columnTotals==0){
					// Total number of columns
					columnTotals = row.length;
					
					// Save the column names to be used as keys for each station's data columns
					columnNames = row;
				}
				
				else{
					// All rows except the first row are the actual data we want to use
					Map<String, String> map = new HashMap<String, String>();
					for (int b = 0; b < columnTotals; b++){
						// Save each data row (a single weather station data) with the specified
						// key: column name (obtained from the first row if condition)
						// value: the actual iterated value according to the separator
						// example: Stationname: Berlin
						map.put(columnNames[b], row[b]);
					}
					
					// Add this hashmap to the hashmap arraylist
					data.add(map);
				}
			}
			
			// Return the final hashmaps arraylist
			return data;
		}
    	
    	catch (FileNotFoundException e) {
			return null;
		}
    }
}
