exports.extron = {
	patch:{
		inputs: {
			"North 1": 4,
			"North 2": 5,
			"Booth": 6,
			"Blu-Ray": 7,
			"Wall Box": 1,
			"South 1": 2,
			"South 2": 3,
		},
		outputs: {
			"Projector": 5,
			"Booth": 1
		}
	},
	table: {
		inputs: {
			north: [
				["Booth", "North 2"],
				["Blu-Ray", "North 1"],
			],
			combined: [
				["Booth"  , "North 2",""       , "Wall Box"],
				["Blu-Ray", "North 1","South 2", "South 1" ]
			],
			split: [
				["Booth"  , "North 2",""       , "Wall Box"],
				["Blu-Ray", "North 1","South 2", "South 1" ]
			],
		},
		outputs: {
			north: [
				["Booth", "Projector"]
			],
			combined: [
				["Booth", "Projector"]
			],
			split: [
				["Booth", "Projector"]
			],
		}
	}
}
exports.screens = {
	patch: {
		"North Up": "raiseNorth",
		"South Up": "raiseSouth",
		"North Down": "lowerNorth",
		"South Down": "lowerSouth",
		"North Adj Up": "jogUpNorth",
		"South Adj Up": "jogUpSouth",
		"North Adj Down": "jogDownNorth",
		"South Adj Down": "jogDownSouth"
	},
	table: {
		north: [
			["Up", "Adj Up"],
			["Down", "Adj Down"]
		],
		south: [
			["Up", "Adj Up"],
			["Down", "Adj Down"]
		],
		combined: [
			["North Up", "North Adj Up", "South Up", "South Adj Up"],
			["North Down", "North Adj Down", "South Down", "South Adj Down"]
		],
		split: [
			["North Up", "North Adj Up", "South Up", "South Adj Up"],
			["North Down", "North Adj Down", "South Down", "South Adj Down"]
		],
	}
}
exports.projector = {
	table: {
		north: [
			["Blu-Ray Control", "On"],
			["Preset North", "Off"]
		],
		combined: [
			["Blu-Ray Control", "Preset High", "On"],
			["Preset North", "Preset Low", "Off"]
		],
		split: [
			["Blu-Ray Control", "On"],
			["Preset North", "Off"]
		],
	},
	patch: {
		presets: {
			North:5,
			High:7,
			Low:8
		}
	}
}
exports.bluRayControl = {
	table: {
		north: [
			["Off","","Up","","On"],
			["Return","Left","Enter","Right","Vol Up"],
			["Title Menu","","Down","","Mute"],
			["Menu", "Prev","Down","Next","Vol Down"],
			["Rewind", "Stop", "Play", "Pause", "Fast Forward"],
		],
		south: [

		],
		combined: [
			["Off","","Up","","On"],
			["Return","Left","Enter","Right","Vol Up"],
			["Title Menu","","Down","","Mute"],
			["Menu", "Prev","Down","Next","Vol Down"],
			["Rewind", "Stop", "Play", "Pause", "Fast Forward"],
		],
		split: [
			["Off","","Up","","On"],
			["Return","Left","Enter","Right","Vol Up"],
			["Title Menu","","Down","","Mute"],
			["Menu", "Prev","Down","Next","Vol Down"],
			["Rewind", "Stop", "Play", "Pause", "Fast Forward"],
		]
	},
	patch: {
		On: "PON",
		Off: "POF",
		"Vol Up":"VUP",
		"Vol Down": "VDN",
		Mute: "MUT",
		Play: "PLA",
		Stop: "STP",
		Pause: "PAU",
		Prev: "PRE",
		Next: "NXT",
		"Fast Forward": "FWD",
		Rewind: "REV",
		Menu: "MNU",
		"Title Menu": "TTL",
		Up: "NUP",
		Down: "NDN",
		Left: "NLT",
		Right: "NRT",
		Enter: "SEL",
		Return: "RET",
	}
}
exports.blackouts = {
	table:{
		north: [
			["Open NE","Close NE","",""],
			["Open N","Close N","",""],
			["","","",""],
			["","Close NW","Close W","Close SW"],
			["","Open NW","Open W","Open SW"]
		],
		south: [
			["Open Viewing","","Close SE","Open SE"],
			["Close Viewing","","Close S","Open S"],
			["","","Close SSW","Open SSW"],
			["Close NW","Close W","Close SW",""],
			["Open NW","Open W","Open SW",""]
		],
		combined: [
			["Open NE", "Close NE" , ""        , ""       , "Open Viewing", ""         , "Close SE" , "Open SE" ],
			["Open N" , "Close N"  , ""        , ""       , "Close Viewing",""         , "Close S"  , "Open S"  ],
			[""       , ""         , ""        , ""       , ""            , ""         , "Close SSW", "Open SSW"],
			[""       , "Close NNW", "Close NW", "Close WNW", "Close W"   , "Close WSW", "Close SW" , "" ],
			[""       , "Open NNW" , "Open NW" , "Open WNW" , "Open W"    , "Open WSW" , "Open SW" , "" ],
		],
		split: [
			["Open NE", "Close NE" , ""        , ""       , "Open Viewing", ""         , "Close SE" , "Open SE" ],
			["Open N" , "Close N"  , ""        , ""       , "Close Viewing",""         , "Close S"  , "Open S"  ],
			[""       , ""         , ""        , ""       , ""            , ""         , "Close SSW", "Open SSW"],
			[""       , "Close NNW", "Close NW", "Close WNW", "Close W"   , "Close WSW", "Close SW" , "" ],
			[""       , "Open NNW" , "Open NW" , "Open WNW" , "Open W"    , "Open WSW" , "Open SW" , "" ],
		],
	},
	patch: {
		north: {
			NE:11,
			N:10,
			NW:9,
			W:8,
			SW:7,
			all:"north",
		},
		south: {
			NW:6,
			W:5,
			SW:4,
			SSW:3,
			S:2,
			SE:1,
			Viewing:0,
			all:"south",
		},
		combined: {
			NE:11,
			N:10,
			NNW:9,
			NW:8,
			WNW:7,
			W:6,
			WSW:5,
			SW:4,
			SSW:3,
			S:2,
			SE:1,
			Viewing:0,
			all:"all",
		},
		split: {
			NE:11,
			N:10,
			NNW:9,
			NW:8,
			WNW:7,
			W:6,
			WSW:5,
			SW:4,
			SSW:3,
			S:2,
			SE:1,
			Viewing:0,
			all:"all",
		},
	}
};
exports.velour= {
	table: {
		north: [
			["Open Wall N", "Open Wall S"],
			["Close Wall N", "Close Wall S"],
			["",""],
			["",""],
			["Close Window N", "Close Window S"],
			["Open Window N", "Open Window S"]
		],
		south: [
			["Open Wall N", "Open Wall S","",""],
			["Close Wall N", "Close Wall S","",""],
			["","","Close S Window E","Open S Window E"],
			["","","Close S Window W","Open S Window W"],
			["Close W Window N", "Close W Window S","",""],
			["Open W Window N", "Open W Window S","",""]
		],
		combined: [
			["Open N Wall N", "Open N Wall S", "Open S Wall N", "Open S Wall S","",""],
			["Close N Wall N", "Close N Wall S", "Close S Wall N", "Close S Wall S","",""],
			["","", "","","Close S Window E","Open S Window E"],
			["","", "","","Close S Window W","Open S Window W"],
			["Close NW Window N", "Close NW Window S", "Close SW Window N", "Close SW Window S","",""],
			["Open NW Window N", "Open NW Window S", "Open SW Window N", "Open SW Window S","",""]
		],
		split: [
			["Open N Wall N", "Open N Wall S", "Open S Wall N", "Open S Wall S","",""],
			["Close N Wall N", "Close N Wall S", "Close S Wall N", "Close S Wall S","",""],
			["","", "","","Close S Window E","Open S Window E"],
			["","", "","","Close S Window W","Open S Window W"],
			["Close NW Window N", "Close NW Window S", "Close SW Window N", "Close SW Window S","",""],
			["Open NW Window N", "Open NW Window S", "Open SW Window N", "Open SW Window S","",""]
		],
	},
	patch: {
		north: {
			"Wall N":1,
			"Wall S":2,
			"Window N":10,
			"Window S": 9
		},
		south: {
			"Wall N":3,
			"Wall S":4,
			"S Window E": 5,
			"S Window W": 6,
			"W Window S": 7,
			"W Window N": 8
		},
		combined: {
			"N Wall N":1,
			"N Wall S":2,
			"S Wall N":3,
			"S Wall S":4,
			"S Window E": 5,
			"S Window W": 6,
			"SW Window S": 7,
			"SW Window N": 8,
			"NW Window S":9,
			"NW Window N": 10
		},
		split: {
			"N Wall N":1,
			"N Wall S":2,
			"S Wall N":3,
			"S Wall S":4,
			"S Window E": 5,
			"S Window W": 6,
			"SW Window S": 7,
			"SW Window N": 8,
			"NW Window S":9,
			"NW Window N": 10
		},
	}
};
exports.paradigm = {
	presets:{
		north: [
			["House Full", "House Half", "House 25", "House Glow", "House Out"],
			["Custom 1", "Custom 2", "Custom 3", "Custom 4", "Custom 5"]
		],
		south: [
			["House Full", "House Half", "House 25", "House Glow", "House Out"],
			["Custom 1", "Custom 2", "Custom 3", "Custom 4", "Custom 5"]
		],
		combined: [
			["House Full", "House Half", "House 25", "House Glow", "House Out"],
			["Custom 1", "Custom 2", "Custom 3", "Custom 4", "Custom 5"],
			["Stage 1", "Stage 2", "Stage 3", "Stage 4", ""],
			["Stage 5", "Stage 6", "Stage 7", "Stage 8", ""]
		],
		split: [
			["North House Full", "North House Half", "North House 25", "South House Full", "South House Half", "South House 25"],
			["North House Glow", "North House Out" , ""              , "South House Glow", "South House Out", ""],
			["North Custom 1"  , "North Custom 2"  , "North Custom 3", "South Custom 1", "South Custom 2", "South Custom 3"],
			["North Custom 4"  , "North Custom 5"  , ""              , "South Custom 4", "South Custom 5", ""]
		]
	},
	spaces: {
		north: "Studio North",
		south: "Studio South",
		combined: "Global"
	}
}
