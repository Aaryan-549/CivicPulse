import 'package:app/constants.dart';
import 'package:app/widgets/menu_card.dart';
import 'package:app/widgets/subcategory_icon.dart';
import 'package:flutter/material.dart';
import 'package:app/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class TrafficViolationPageContents extends StatefulWidget {
  const TrafficViolationPageContents({super.key});

  @override
  State<TrafficViolationPageContents> createState() =>
      _TrafficViolationPageContentsState();
}

class _TrafficViolationPageContentsState
    extends State<TrafficViolationPageContents> {
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
                  "Report any traffic violations in your area",
                  style: TextStyle(fontSize: 14),
                ),
                SizedBox(height: 25),
                Text(
                  "2 wheelers",
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
                      icon: Icons.two_wheeler_sharp,
                      cat: "2 wheelers",
                      subcatText1: "No Helmet",
                      subcatText2: "",
                    ),
                    SubCategory(
                      icon: Icons.groups_3_sharp,
                      cat: "2 wheelers",
                      subcatText1: "Triple",
                      subcatText2: "Riding",
                    ),
                    SubCategory(
                      icon: Icons.phone_in_talk_sharp,
                      cat: "2 wheelers",
                      subcatText1: "Using",
                      subcatText2: "Mobile",
                    ),
                    SubCategory(
                      icon: Icons.cloud,
                      cat: "2 wheelers",
                      subcatText1: "Excessive",
                      subcatText2: "Pollution",
                    ),
                  ],
                  subcats2: [
                    SubCategory(
                      icon: Icons.plumbing_sharp,
                      cat: "2 wheelers",
                      subcatText1: "Illegal",
                      subcatText2: "Modification",
                    ),
                    SubCategory(
                      icon: Icons.block_sharp,
                      cat: "2 wheelers",
                      subcatText1: "Wrong",
                      subcatText2: "Parking",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "2 wheelers",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                ),
                SizedBox(height: 25),
                Text(
                  "4 wheelers",
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
                      icon: Icons.warning_amber_sharp,
                      cat: "4 wheelers",
                      subcatText1: "No",
                      subcatText2: "Seatbelt",
                    ),
                    SubCategory(
                      icon: Icons.phone_in_talk_sharp,
                      cat: "4 wheelers",
                      subcatText1: "Using",
                      subcatText2: "Mobile",
                    ),
                    SubCategory(
                      icon: Icons.cloud,
                      cat: "4 wheelers",
                      subcatText1: "Excessive",
                      subcatText2: "Pollution",
                    ),
                    SubCategory(
                      icon: Icons.plumbing_sharp,
                      cat: "4 wheelers",
                      subcatText1: "Illegal",
                      subcatText2: "Modification",
                    ),
                  ],
                  subcats2: [
                    SubCategory(
                      icon: Icons.block_sharp,
                      cat: "4 wheelers",
                      subcatText1: "Wrong",
                      subcatText2: "Parking",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "4 wheelers",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                ),
                SizedBox(height: 25),
                Text(
                  "Signal & Driving",
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
                      icon: Icons.traffic_sharp,
                      cat: "Signal & Driving",
                      subcatText1: "Red Light",
                      subcatText2: "Jump",
                    ),
                    SubCategory(
                      icon: Icons.u_turn_left_sharp,
                      cat: "Signal & Driving",
                      subcatText1: "Wrong Side",
                      subcatText2: "Driving",
                    ),
                    SubCategory(
                      icon: Icons.bolt_sharp,
                      cat: "Signal & Driving",
                      subcatText1: "Rash",
                      subcatText2: "Driving",
                    ),
                    SubCategory(
                      icon: Icons.speed_sharp,
                      cat: "Signal & Driving",
                      subcatText1: "Over Speed",
                      subcatText2: "Limit",
                    ),
                  ],
                  subcats2: [
                    SubCategory(
                      icon: Icons.directions_walk_sharp,
                      cat: "Signal & Driving",
                      subcatText1: "Blocking",
                      subcatText2: "Crosswalk",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Signal & Driving",
                      subcatText1: "Others",
                      subcatText2: "",
                    ),
                  ],
                ),
                SizedBox(height: 25),
                Text(
                  "Number Plate",
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
                      icon: Icons.dangerous_sharp,
                      cat: "Number Plate",
                      subcatText1: "Missing",
                      subcatText2: "Number Plate",
                    ),
                    SubCategory(
                      icon: Icons.hide_source_sharp,
                      cat: "Number Plate",
                      subcatText1: "Tampered",
                      subcatText2: "Number Plate",
                    ),
                    SubCategory(
                      icon: Icons.text_fields_sharp,
                      cat: "Number Plate",
                      subcatText1: "Non-Standard",
                      subcatText2: "Number Plate",
                    ),
                    SubCategory(
                      icon: Icons.more_horiz_sharp,
                      cat: "Number Plate",
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
