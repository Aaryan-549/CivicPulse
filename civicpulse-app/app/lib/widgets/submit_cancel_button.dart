import 'package:app/constants.dart';
import 'package:flutter/material.dart';

class SubmitCancelButton extends StatelessWidget {
  final String text;
  final GestureTapCallback onTap;
  const SubmitCancelButton({
    super.key,
    required this.text,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: MediaQuery.of(context).size.width * 0.6,
        height: 45,
        decoration: text == "Submit"
            ? BoxDecoration(
                color: blueColor,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: const Color.fromARGB(
                      255,
                      213,
                      188,
                      188,
                    ).withValues(alpha: 0.7),
                    spreadRadius: 2,
                    blurRadius: 7,
                    offset: const Offset(0, 1),
                  ),
                ],
              )
            : BoxDecoration(
                color: Colors.white,
                border: Border.all(color: blueColor, width: 2),
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withValues(alpha: 0.7),
                    spreadRadius: 2,
                    blurRadius: 7,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
        child: Center(
          child: Text(
            text,
            style: text == "Submit"
                ? TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  )
                : TextStyle(
                    color: blueColor,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
          ),
        ),
      ),
    );
  }
}
