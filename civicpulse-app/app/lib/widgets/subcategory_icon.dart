import 'package:app/constants.dart';
import 'package:flutter/material.dart';

class SubCategory extends StatelessWidget {
  final IconData icon;
  final String cat;
  final String subcatText1;
  final String subcatText2;

  const SubCategory({
    super.key,
    required this.icon,
    required this.cat,
    required this.subcatText1,
    required this.subcatText2,
  });

  bool _isCivicCategory(String category) {
    // Define civic categories
    final civicCategories = [
      'Roads & Infrastructure',
      'Water Supply & Sanitation',
      'Electricity',
      'Waste Management',
      'Environment',
      'Public Property Damage',
      'Civic Administration',
    ];
    return civicCategories.contains(category);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Determine the correct route based on category
        final route = _isCivicCategory(cat)
            ? "/civic_issue_complaint"
            : "/traffic_complaint";

        Navigator.pushNamed(
          context,
          route,
          arguments: {
            'cat': cat,
            'subcat': (subcatText2 != "")
                ? "$subcatText1 $subcatText2"
                : "$subcatText1",
          },
        );
      },
      child: SizedBox(
        width: (MediaQuery.of(context).size.width - 60) / 4,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Icon(icon, color: blueColor),
            Text(
              subcatText1,
              style: TextStyle(color: Colors.black, fontSize: 11),
            ),
            Text(
              subcatText2,
              style: TextStyle(color: Colors.black, fontSize: 11),
            ),
          ],
        ),
      ),
    );
  }
}
