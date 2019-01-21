The data creator can be used to produce large data sets
for the Redfish event sequencer. It requires NodeJS and
a set of Mockup data for each type of report that you
want to use.


Start by looking at the included config.js file. You can
modify this config file (or create a new one) to define
the type, frequency, and pattern of the generated data.
You can specify an arbitrary number of entries in the
MockupPatterns array. Note that increaseing the length
of this array will increase the time to generate data.
If generation is taking too long, decrease the time amount
of data being generated.


You can use these switches:
-c <path> 	| Specify the config file to use to generate data, default config.js
-t <integer>	| Specify the number of seconds worth of data to produce, default 36000 (10 hours)
-o <filename>	| Specify the output filename, default output.csv

Examples:
All default
prompt> node rfmockdatacreator.js 

10 minutes of data, saved to smallData.csv
prompt> node rfmockdatacreator.js -t 600 -o smallData.csv

100 hours of data, saved to bigData.csv, using myConfig.js to define output
prompt> node rfmockdatacreator.js -t 360000 -o bigData.csv -c myConfig.js

