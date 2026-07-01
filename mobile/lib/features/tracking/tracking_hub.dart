import 'package:flutter/material.dart';
import '../../core/widgets/custom_paint_widgets.dart';

class TrackingHub extends StatefulWidget {
  final Map<String, dynamic> patientData;
  final Function(int) onLogWater;
  final Function(String, bool) onToggleMedication;

  const TrackingHub({
    super.key,
    required this.patientData,
    required this.onLogWater,
    required this.onToggleMedication,
  });

  @override
  State<TrackingHub> createState() => _TrackingHubState();
}

class _TrackingHubState extends State<TrackingHub> {
  final List<Map<String, dynamic>> _meals = [
    {'name': 'Breakfast', 'time': '07:30 AM', 'logged': true, 'calories': 450},
    {'name': 'Lunch', 'time': '01:00 PM', 'logged': false, 'calories': 680},
    {'name': 'Dinner', 'time': '07:30 PM', 'logged': false, 'calories': 520},
  ];

  @override
  Widget build(BuildContext context) {
    final double waterRatio =
        widget.patientData['waterDrank'] / widget.patientData['waterTarget'];
    final int waterDrank = widget.patientData['waterDrank'];
    final int waterTarget = widget.patientData['waterTarget'];

    final List<Map<String, dynamic>> medications =
        widget.patientData['medications'];
    final int completedMeds =
        medications.where((m) => m['taken'] == true).length;
    final double medProgress =
        medications.isNotEmpty ? completedMeds / medications.length : 0.0;

    // Simulated weekly compliance chart data
    final List<double> weeklyAdherence = [
      1.0,
      0.75,
      1.0,
      1.0,
      0.5,
      0.8,
      medProgress
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section 1: Hydration tracker using CircularProgressRing CustomPainter
          Card(
            color: const Color(0xFF1E293B),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Water Hydration Target',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '$waterDrank mL / $waterTarget mL',
                          style:
                              const TextStyle(color: Colors.grey, fontSize: 13),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            ElevatedButton(
                              onPressed: () => widget.onLogWater(250),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF0D9488),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8)),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 8),
                              ),
                              child: const Text('+250 mL',
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 12)),
                            ),
                            const SizedBox(width: 8),
                            OutlinedButton(
                              onPressed: () => widget.onLogWater(500),
                              style: OutlinedButton.styleFrom(
                                side:
                                    const BorderSide(color: Color(0xFF0D9488)),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8)),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 8),
                              ),
                              child: const Text('+500 mL',
                                  style: TextStyle(
                                      color: Color(0xFF0D9488), fontSize: 12)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: 90,
                    height: 90,
                    margin: const EdgeInsets.only(left: 12),
                    child: CustomPaint(
                      painter: ProgressRingPainter(
                        progress: waterRatio.clamp(0.0, 1.0),
                        baseColor: Colors.grey[800]!,
                        progressColor: const Color(0xFF0D9488),
                        strokeWidth: 8,
                      ),
                      child: Center(
                        child: Text(
                          '${(waterRatio * 100).round()}%',
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 16),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Section 2: Medication List with WeeklyAdherenceChart
          Card(
            color: const Color(0xFF1E293B),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Medication Schedule',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '$completedMeds / ${medications.length} Done',
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Pill checklist items
                  ...medications.map((med) => CheckboxListTile(
                        value: med['taken'],
                        title: Text(med['name'],
                            style: const TextStyle(
                                color: Colors.white, fontSize: 14)),
                        subtitle: Text(med['time'],
                            style: const TextStyle(
                                color: Colors.grey, fontSize: 12)),
                        activeColor: const Color(0xFF0D9488),
                        contentPadding: EdgeInsets.zero,
                        onChanged: (val) {
                          if (val != null) {
                            widget.onToggleMedication(med['name'], val);
                          }
                        },
                      )),

                  const Divider(color: Colors.grey, height: 24),

                  const Text(
                    'Medication Compliance Adherence',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 100,
                    width: double.infinity,
                    child: CustomPaint(
                      painter: AdherenceChartPainter(
                        data: weeklyAdherence,
                        barColor: Colors.grey,
                        activeBarColor: const Color(0xFF0D9488),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Mon',
                          style: TextStyle(color: Colors.grey, fontSize: 10)),
                      Text('Tue',
                          style: TextStyle(color: Colors.grey, fontSize: 10)),
                      Text('Wed',
                          style: TextStyle(color: Colors.grey, fontSize: 10)),
                      Text('Thu',
                          style: TextStyle(color: Colors.grey, fontSize: 10)),
                      Text('Fri',
                          style: TextStyle(color: Colors.grey, fontSize: 10)),
                      Text('Sat',
                          style: TextStyle(color: Colors.grey, fontSize: 10)),
                      Text('Today',
                          style: TextStyle(
                              color: Color(0xFF0D9488),
                              fontSize: 10,
                              fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Section 3: Meal Plan checklist
          const Text(
            'Daily Nutrition Checklist',
            style: TextStyle(
                color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ..._meals.map((meal) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[800]!),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          meal['logged']
                              ? Icons.restaurant
                              : Icons.restaurant_menu_outlined,
                          color: meal['logged']
                              ? const Color(0xFF0D9488)
                              : Colors.grey,
                        ),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              meal['name'],
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Time: ${meal['time']} | ${meal['calories']} kcal',
                              style: const TextStyle(
                                  color: Colors.grey, fontSize: 12),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Switch(
                      value: meal['logged'],
                      activeColor: const Color(0xFF0D9488),
                      onChanged: (val) {
                        setState(() {
                          meal['logged'] = val;
                        });
                      },
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}
