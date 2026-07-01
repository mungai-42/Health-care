import 'dart:math';
import 'package:flutter/material.dart';

class ProgressRingPainter extends CustomPainter {
  final double progress;
  final Color baseColor;
  final Color progressColor;
  final double strokeWidth;

  ProgressRingPainter({
    required this.progress,
    required this.baseColor,
    required this.progressColor,
    this.strokeWidth = 10.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    // Base circle paint
    final basePaint = Paint()
      ..color = baseColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    canvas.drawCircle(center, radius, basePaint);

    // Progress arc paint
    final progressPaint = Paint()
      ..color = progressColor
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = strokeWidth;

    final sweepAngle = 2 * pi * progress;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2, // Start at the top (12 o'clock)
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant ProgressRingPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.baseColor != baseColor ||
        oldDelegate.progressColor != progressColor ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}

class AdherenceChartPainter extends CustomPainter {
  final List<double> data; // 7 items representing days (range 0.0 to 1.0)
  final Color barColor;
  final Color activeBarColor;

  AdherenceChartPainter({
    required this.data,
    required this.barColor,
    required this.activeBarColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final double spacing = size.width / (data.length * 1.5 + 0.5);
    final double barWidth = spacing * 0.8;

    final Paint linePaint = Paint()
      ..color = barColor.withOpacity(0.15)
      ..strokeWidth = 1;

    // Draw background guide lines
    canvas.drawLine(Offset(0, size.height * 0.25),
        Offset(size.width, size.height * 0.25), linePaint);
    canvas.drawLine(Offset(0, size.height * 0.5),
        Offset(size.width, size.height * 0.5), linePaint);
    canvas.drawLine(Offset(0, size.height * 0.75),
        Offset(size.width, size.height * 0.75), linePaint);

    for (int i = 0; i < data.length; i++) {
      final double val = data[i];
      final double x = spacing + i * (barWidth + spacing * 0.7);

      // Calculate coordinates from the bottom
      final double y = size.height - (val * size.height);

      // Background pill slot
      final Paint bgPillPaint = Paint()
        ..color = barColor.withOpacity(0.08)
        ..style = PaintingStyle.fill;

      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(x, 0, barWidth, size.height),
          Radius.circular(barWidth / 2),
        ),
        bgPillPaint,
      );

      // Active fill bar
      final Paint fillPaint = Paint()
        ..color = val >= 1.0 ? activeBarColor : activeBarColor.withOpacity(0.6)
        ..style = PaintingStyle.fill;

      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(x, y, barWidth, size.height - y),
          Radius.circular(barWidth / 2),
        ),
        fillPaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant AdherenceChartPainter oldDelegate) {
    return oldDelegate.data != data ||
        oldDelegate.barColor != barColor ||
        oldDelegate.activeBarColor != activeBarColor;
  }
}
