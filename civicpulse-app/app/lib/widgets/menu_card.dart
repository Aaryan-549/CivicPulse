import 'package:flutter/material.dart';

class MenuCard extends StatelessWidget {
  final List<Widget> subcats1;
  final List<Widget> subcats2;
  final double rows;

  const MenuCard({
    super.key,
    required this.subcats1,
    required this.subcats2,
    required this.rows,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
      child: Container(
        width: MediaQuery.of(context).size.width,
        height: rows == 1 ? 80 : 150,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15.0),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withValues(alpha: 0.7),
              spreadRadius: 2,
              blurRadius: 7,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: rows == 1
              ? MainAxisAlignment.center
              : MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: subcats1,
            ),
            rows == 2
                ? Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: subcats2,
                  )
                : SizedBox(),
          ],
        ),
      ),
    );
  }
}
