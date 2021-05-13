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
			]
		},
		outputs: {
			north: [
				["Booth", "Projector"]
			],
			combined: [
				[
				 ["Booth", "Projector"]
			 ]
			]
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
		]
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
		]
	}
}
