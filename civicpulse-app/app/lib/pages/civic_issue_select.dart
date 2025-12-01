import 'package:app/constants.dart';
import 'package:app/pages/my_complaints.dart';
import 'package:app/pages/profile.dart';
import 'package:app/pages/traffic_violation_select.dart';
import 'package:app/widgets/menu_card.dart';
import 'package:app/widgets/subcategory_icon.dart';
import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:app/services/auth_service.dart';
import 'package:app/providers/auth_provider.dart';
import 'package:app/providers/location_provider.dart';
import 'package:provider/provider.dart';

class CivicIssueSelect extends StatefulWidget {
  const CivicIssueSelect({super.key});

  @override
  State<CivicIssueSelect> createState() => _CivicIssueSelectState();
}

class _CivicIssueSelectState extends State<CivicIssueSelect> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    CivicIssueSelectPageContents(),
    TrafficViolationPageContents(),
    MyComplaintsPageContents(),
    ProfilePageContents(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "CivicPulse",
          style: TextStyle(
            color: greyColor,
            fontWeight: FontWeight.bold,
            fontSize: 24,
          ),
        ),
        actions: [
          Consumer<LocationProvider>(
            builder: (context, locationProvider, child) {
              return Row(
                children: [
                  Icon(Icons.location_on, color: greyColor),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(3, 0, 15, 0),
                    child: Text(
                      locationProvider.locationText,
                      style: TextStyle(
                        color: greyColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ],
        backgroundColor: blueColor,
        elevation: 2,
        scrolledUnderElevation: 2,
      ),
      bottomNavigationBar: Container(
        color: blueColor.withValues(alpha: 0.2),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: GNav(
            selectedIndex: _selectedIndex,
            gap: 5,
            padding: EdgeInsetsGeometry.all(12),
            color: Colors.grey.shade500,
            activeColor: blueColor,
            tabActiveBorder: Border.all(color: blueColor, width: 2),
            onTabChange: (index) {
              setState(() {
                _selectedIndex = index;
              });
            },
            tabs: const [
              GButton(
                icon: Icons.location_city_sharp,
                text: "Report Civic Issue",
              ),
              GButton(icon: Icons.traffic_sharp, text: "Raise e-Challan"),
              GButton(icon: Icons.receipt_long_sharp, text: "My Complaints"),
              GButton(icon: Icons.person_outline_sharp, text: "Profile"),
            ],
          ),
        ),
      ),
      body: _pages[_selectedIndex],
    );
  }
}

class CivicIssueSelectPageContents extends StatefulWidget {
  const CivicIssueSelectPageContents({super.key});

  @override
  State<CivicIssueSelectPageContents> createState() =>
      _CivicIssueSelectPageContentsState();
}

class _CivicIssueSelectPageContentsState
    extends State<CivicIssueSelectPageContents> {

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Container(
          color: greyColor,
          width: MediaQuery.of(context).size.width,
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Consumer<AuthProvider>(
                  builder: (context, authProvider, child) {
                    return Text(
                      "Hello, ${authProvider.userName}",
                      style: TextStyle(
                        color: darkGreyColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                      ),
                    );
                  },
                ),
                Text(
                  "Report civic issues in your area",
                  style: TextStyle(fontSize: 14),
                ),
                SizedBox(height: 25),
                Text(
                  "Roads & Infrastructure",
                  style: TextStyle(
                    color: darkGreyColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                MenuCard(
                  rows: 1,
                  subcats1: [
                    SubCategory(
                      icon: Icons.edit_road_sharp,
                      cat: "Roads & Infrastructure",
                      subcatText1: "Damaged",
                      subcatText2: "Roads",
                    ),
                    SubCategory(
                      icon: Icons.lightbulb_outline,
                      cat: "Roads & Infrastructure",
                      subcatText1: "Damaged",
                      subcatText2: "Streetlights",
                    ),
                    SubCategory(
                      icon: Icons.circle_outlined,
                      cat: "Roads & Infrastructure",
                      subcatText1: "Missing",
                      subcatText2: "Manholes",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Roads & Infrastructure",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                  subcats2: [],
                ),
                SizedBox(height: 25),
                Text(
                  "Water Supply & Sanitation",
                  style: TextStyle(
                    color: darkGreyColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                MenuCard(
                  rows: 2,
                  subcats1: [
                    SubCategory(
                      icon: Icons.water_drop_outlined,
                      cat: "Water Supply & Sanitation",
                      subcatText1: "No Water",
                      subcatText2: "Supply",
                    ),
                    SubCategory(
                      icon: Icons.plumbing_sharp,
                      cat: "Water Supply & Sanitation",
                      subcatText1: "Leaking",
                      subcatText2: "Pipes",
                    ),
                    SubCategory(
                      icon: Icons.water,
                      cat: "Water Supply & Sanitation",
                      subcatText1: "Water",
                      subcatText2: "Logging",
                    ),
                    SubCategory(
                      icon: Icons.science_outlined,
                      cat: "Water Supply & Sanitation",
                      subcatText1: "Contaminated",
                      subcatText2: "Water",
                    ),
                  ],
                  subcats2: [
                    SubCategory(
                      icon: Icons.warning_amber_outlined,
                      cat: "Water Supply & Sanitation",
                      subcatText1: "Overflowing",
                      subcatText2: "Sewers",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Water Supply & Sanitation",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                ),
                SizedBox(height: 25),
                Text(
                  "Electricity",
                  style: TextStyle(
                    color: darkGreyColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                MenuCard(
                  rows: 1,
                  subcats1: [
                    SubCategory(
                      icon: Icons.bolt_sharp,
                      cat: "Electricity",
                      subcatText1: "Power",
                      subcatText2: "Outage",
                    ),
                    SubCategory(
                      icon: Icons.cable_sharp,
                      cat: "Electricity",
                      subcatText1: "Damaged",
                      subcatText2: "Equipment",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Electricity",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                  subcats2: [],
                ),
                SizedBox(height: 25),
                Text(
                  "Waste Management",
                  style: TextStyle(
                    color: darkGreyColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                MenuCard(
                  rows: 2,
                  subcats1: [
                    SubCategory(
                      icon: Icons.delete_outline,
                      cat: "Waste Management",
                      subcatText1: "Overflowing",
                      subcatText2: "Garbage",
                    ),
                    SubCategory(
                      icon: Icons.delete_forever_sharp,
                      cat: "Waste Management",
                      subcatText1: "Garbage not",
                      subcatText2: "Collected",
                    ),
                    SubCategory(
                      icon: Icons.report_problem_outlined,
                      cat: "Waste Management",
                      subcatText1: "Illegal",
                      subcatText2: "Dumping",
                    ),
                    SubCategory(
                      icon: Icons.delete_sweep_outlined,
                      cat: "Waste Management",
                      subcatText1: "Missing",
                      subcatText2: "Dustbin",
                    ),
                  ],
                  subcats2: [
                    SubCategory(
                      icon: Icons.add_circle_outline_sharp,
                      cat: "Waste Management",
                      subcatText1: "Suggest",
                      subcatText2: "Dustbin",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Waste Management",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                ),
                SizedBox(height: 25),
                Text(
                  "Environment",
                  style: TextStyle(
                    color: darkGreyColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                MenuCard(
                  rows: 1,
                  subcats1: [
                    SubCategory(
                      icon: Icons.park_sharp,
                      cat: "Environment",
                      subcatText1: "Fallen",
                      subcatText2: "Trees",
                    ),
                    SubCategory(
                      icon: Icons.cancel_outlined,
                      cat: "Environment",
                      subcatText1: "Illegal Tree",
                      subcatText2: "Cutting",
                    ),
                    SubCategory(
                      icon: Icons.construction_sharp,
                      cat: "Environment",
                      subcatText1: "Damaged",
                      subcatText2: "Park",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Environment",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                  subcats2: [],
                ),
                SizedBox(height: 25),
                Text(
                  "Public Property Damage",
                  style: TextStyle(
                    color: darkGreyColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                MenuCard(
                  rows: 2,
                  subcats1: [
                    SubCategory(
                      icon: Icons.brush_sharp,
                      cat: "Public Property Damage",
                      subcatText1: "Vandalized",
                      subcatText2: "Walls",
                    ),
                    SubCategory(
                      icon: Icons.directions_bus_sharp,
                      cat: "Public Property Damage",
                      subcatText1: "Broken",
                      subcatText2: "Bus Stops",
                    ),
                    SubCategory(
                      icon: Icons.signpost_outlined,
                      cat: "Public Property Damage",
                      subcatText1: "Missing",
                      subcatText2: "Boards",
                    ),
                    SubCategory(
                      icon: Icons.family_restroom_sharp,
                      cat: "Public Property Damage",
                      subcatText1: "Poor",
                      subcatText2: "Toilets",
                    ),
                  ],
                  subcats2: [
                    SubCategory(
                      icon: Icons.water_drop_outlined,
                      cat: "Public Property Damage",
                      subcatText1: "Water ATM",
                      subcatText2: "Not Working",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Public Property Damage",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                ),
                SizedBox(height: 25),
                Text(
                  "Civic Administration",
                  style: TextStyle(
                    color: darkGreyColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                MenuCard(
                  rows: 1,
                  subcats1: [
                    SubCategory(
                      icon: Icons.gavel,
                      cat: "Civic Administration",
                      subcatText1: "Corruption",
                      subcatText2: "Complaint",
                    ),
                    SubCategory(
                      icon: Icons.hourglass_bottom_sharp,
                      cat: "Civic Administration",
                      subcatText1: "Delay in",
                      subcatText2: "Service",
                    ),
                    SubCategory(
                      icon: Icons.report_gmailerrorred_sharp,
                      cat: "Civic Administration",
                      subcatText1: "Staff",
                      subcatText2: "Misbehaving",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Civic Administration",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                  subcats2: [],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
