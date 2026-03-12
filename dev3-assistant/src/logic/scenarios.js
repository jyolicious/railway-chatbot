/**
 * scenarios.json
 * 
 * 10 pre-baked cascade scenarios for demo.
 * Each represents a realistic delay propagation across Indian rail corridors.
 */

const scenarios = [
  {
    id: 1,
    name: "Nagpur Gridlock",
    description: "2-hour delay at Nagpur Junction spreads through Central India",
    trigger_station: "NGP",
    delay_minutes: 120,
    passengers: 14200,
    disrupted_trains: ["12952 Rajdhani Express", "12269 Duronto"],
    propagation: [
      { station_code: "BPL", delay_added: 45, passengers_added: 3200, affected_trains: ["12952"], offset_seconds: 900 },
      { station_code: "JHS", delay_added: 30, passengers_added: 2100, affected_trains: ["12952", "12269"], offset_seconds: 1800 },
      { station_code: "NDLS", delay_added: 60, passengers_added: 5200, affected_trains: ["12952"], offset_seconds: 3600 }
    ]
  },
  {
    id: 2,
    name: "Howrah Congestion",
    description: "Platform failure at Howrah cascades through Northeast",
    trigger_station: "HWH",
    delay_minutes: 90,
    passengers: 11500,
    disrupted_trains: ["12301 Kolkata Rajdhani", "12341 Poorva Express"],
    propagation: [
      { station_code: "ASN", delay_added: 35, passengers_added: 2800, affected_trains: ["12341"], offset_seconds: 800 },
      { station_code: "PRG", delay_added: 25, passengers_added: 1900, affected_trains: ["12301"], offset_seconds: 1600 },
      { station_code: "NDLS", delay_added: 50, passengers_added: 4100, affected_trains: ["12301", "12341"], offset_seconds: 3200 }
    ]
  },
  {
    id: 3,
    name: "Mumbai CST Platform Failure",
    description: "Platform closure at Mumbai Central spreads westward",
    trigger_station: "BCT",
    delay_minutes: 150,
    passengers: 18400,
    disrupted_trains: ["22103 Rajdhani", "12123 Flying Ranee"],
    propagation: [
      { station_code: "PUNE", delay_added: 55, passengers_added: 4100, affected_trains: ["22103"], offset_seconds: 1100 },
      { station_code: "MIRAJ", delay_added: 40, passengers_added: 2900, affected_trains: ["12123"], offset_seconds: 2200 },
      { station_code: "SOLAPUR", delay_added: 65, passengers_added: 5400, affected_trains: ["22103", "12123"], offset_seconds: 4400 },
      { station_code: "GULBARGA", delay_added: 50, passengers_added: 3800, affected_trains: ["22103"], offset_seconds: 6000 }
    ]
  },
  {
    id: 4,
    name: "Delhi Traffic Jam",
    description: "Rush hour congestion at Delhi manifests across North India",
    trigger_station: "NDLS",
    delay_minutes: 75,
    passengers: 9800,
    disrupted_trains: ["14112 Samta Express", "12026 Shatabdi Express"],
    propagation: [
      { station_code: "MEERUT", delay_added: 30, passengers_added: 2100, affected_trains: ["14112"], offset_seconds: 700 },
      { station_code: "BULANDSHAHR", delay_added: 20, passengers_added: 1400, affected_trains: ["14112"], offset_seconds: 1400 },
      { station_code: "MATHURA", delay_added: 35, passengers_added: 2500, affected_trains: ["12026"], offset_seconds: 2800 }
    ]
  },
  {
    id: 5,
    name: "Bangalore Signal Failure",
    description: "Signal system failure forces single-line working",
    trigger_station: "SBC",
    delay_minutes: 110,
    passengers: 12700,
    disrupted_trains: ["12007 Shatabdi", "16032 Mysore Express"],
    propagation: [
      { station_code: "KRISHNARAJAPURAM", delay_added: 40, passengers_added: 2900, affected_trains: ["16032"], offset_seconds: 900 },
      { station_code: "WHITEFIELD", delay_added: 25, passengers_added: 1800, affected_trains: ["12007"], offset_seconds: 1800 },
      { station_code: "VSKP", delay_added: 55, passengers_added: 4200, affected_trains: ["16032"], offset_seconds: 3600 },
      { station_code: "HYDERABAD", delay_added: 60, passengers_added: 4800, affected_trains: ["12007", "16032"], offset_seconds: 5400 }
    ]
  },
  {
    id: 6,
    name: "Chennai Monsoon Disruption",
    description: "Heavy rains cause track damage south of Chennai",
    trigger_station: "MAS",
    delay_minutes: 130,
    passengers: 15600,
    disrupted_trains: ["12625 Kerala Express", "16038 Falaknuma Express"],
    propagation: [
      { station_code: "CHENGALPATTU", delay_added: 50, passengers_added: 3600, affected_trains: ["12625"], offset_seconds: 1100 },
      { station_code: "NELLORE", delay_added: 35, passengers_added: 2500, affected_trains: ["16038"], offset_seconds: 2200 },
      { station_code: "RENIGUNTA", delay_added: 45, passengers_added: 3200, affected_trains: ["16038"], offset_seconds: 3800 },
      { station_code: "BANGALORE", delay_added: 40, passengers_added: 2800, affected_trains: ["12625"], offset_seconds: 5200 }
    ]
  },
  {
    id: 7,
    name: "Ahmedabad Capacity Crunch",
    description: "Hub overload during festival season",
    trigger_station: "ADI",
    delay_minutes: 85,
    passengers: 10200,
    disrupted_trains: ["12009 Shatabdi", "12016 Ashram Express"],
    propagation: [
      { station_code: "VATVA", delay_added: 28, passengers_added: 2000, affected_trains: ["12009"], offset_seconds: 650 },
      { station_code: "NADIAD", delay_added: 22, passengers_added: 1600, affected_trains: ["12016"], offset_seconds: 1300 },
      { station_code: "GODHRA", delay_added: 38, passengers_added: 2700, affected_trains: ["12009", "12016"], offset_seconds: 2600 }
    ]
  },
  {
    id: 8,
    name: "Kolkata Festival Rush",
    description: "Special trains overload during pujo season",
    trigger_station: "KOAA",
    delay_minutes: 95,
    passengers: 13400,
    disrupted_trains: ["12345 Coromandel Express", "12987 Purushottam"],
    propagation: [
      { station_code: "ASANSOL", delay_added: 38, passengers_added: 2700, affected_trains: ["12345"], offset_seconds: 850 },
      { station_code: "DHANBAD", delay_added: 30, passengers_added: 2100, affected_trains: ["12987"], offset_seconds: 1700 },
      { station_code: "GAYA", delay_added: 42, passengers_added: 3000, affected_trains: ["12345", "12987"], offset_seconds: 3400 },
      { station_code: "PATNA", delay_added: 35, passengers_added: 2500, affected_trains: ["12345"], offset_seconds: 4800 }
    ]
  },
  {
    id: 9,
    name: "Lucknow Winter Freeze",
    description: "Fog causes signaling issues across North India",
    trigger_station: "LKO",
    delay_minutes: 105,
    passengers: 11900,
    disrupted_trains: ["12001 Shatabdi", "14055 Brahmputra Mail"],
    propagation: [
      { station_code: "KANPUR", delay_added: 40, passengers_added: 2800, affected_trains: ["12001"], offset_seconds: 900 },
      { station_code: "JHANSI", delay_added: 32, passengers_added: 2300, affected_trains: ["14055"], offset_seconds: 1800 },
      { station_code: "GWALIOR", delay_added: 36, passengers_added: 2600, affected_trains: ["12001", "14055"], offset_seconds: 3600 },
      { station_code: "AGRA", delay_added: 28, passengers_added: 2000, affected_trains: ["12001"], offset_seconds: 4800 }
    ]
  },
  {
    id: 10,
    name: "Surat Summer Heat Wave",
    description: "Track buckling forces speed restrictions",
    trigger_station: "ST",
    delay_minutes: 120,
    passengers: 14800,
    disrupted_trains: ["12901 Shatabdi", "12902 Flying Ranee Express"],
    propagation: [
      { station_code: "BHARUCH", delay_added: 45, passengers_added: 3200, affected_trains: ["12901"], offset_seconds: 1000 },
      { station_code: "ANKLESHWAR", delay_added: 35, passengers_added: 2500, affected_trains: ["12902"], offset_seconds: 2000 },
      { station_code: "VADODARA", delay_added: 50, passengers_added: 3600, affected_trains: ["12901", "12902"], offset_seconds: 4000 },
      { station_code: "RATLAM", delay_added: 42, passengers_added: 3000, affected_trains: ["12902"], offset_seconds: 5800 }
    ]
  }
];

export default scenarios;
