import 'package:flutter/material.dart';

class HomeDashboard extends StatefulWidget {
  final Map<String, dynamic> patientData;
  final VoidCallback onNavigateToTracking;
  final VoidCallback onOpenNotifications;

  const HomeDashboard({
    super.key,
    required this.patientData,
    required this.onNavigateToTracking,
    required this.onOpenNotifications,
  });

  @override
  State<HomeDashboard> createState() => _HomeDashboardState();
}

class _HomeDashboardState extends State<HomeDashboard> {
  final List<Map<String, String>> _tips = [
    {
      'title': 'Managing Sodium Intake',
      'body':
          'Reducing table salt helps reduce blood pressure immediately. Focus on fresh vegetables and spices instead.'
    },
    {
      'title': 'The Importance of Hydration',
      'body':
          'A stable hydration level of 2.5L+ reduces heart workload and decreases systemic arterial tension.'
    },
    {
      'title': 'Post-Lunch Light Walks',
      'body':
          '10 minutes of walking immediately after meals helps prevent postprandial blood sugar spikes.'
    }
  ];

  int _expandedTipIndex = -1;

  @override
  Widget build(BuildContext context) {
    final double waterRatio =
        widget.patientData['waterDrank'] / widget.patientData['waterTarget'];
    final int waterPercent = (waterRatio * 100).round().clamp(0, 100);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting & Profile summary
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Hello,',
                      style: TextStyle(color: Colors.grey, fontSize: 16)),
                  Text(
                    widget.patientData['name'],
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              IconButton(
                icon: const Badge(
                  label: Text('2'),
                  child: Icon(Icons.notifications_outlined,
                      color: Colors.white, size: 28),
                ),
                onPressed: widget.onOpenNotifications,
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Daily Progress Quick Card
          GestureDetector(
            onTap: widget.onNavigateToTracking,
            child: Card(
              color: const Color(0xFF1E293B),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Daily Status Adherence',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Hydration Progress',
                            style: TextStyle(color: Colors.grey)),
                        Text('$waterPercent%',
                            style: const TextStyle(
                                color: Color(0xFF0D9488),
                                fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: waterRatio.clamp(0.0, 1.0),
                        backgroundColor: Colors.grey[800],
                        color: const Color(0xFF0D9488),
                        minHeight: 8,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Row(
                      children: [
                        Icon(Icons.check_circle_outline,
                            color: Colors.green, size: 16),
                        SizedBox(width: 8),
                        Text('Breakfast nutrition logs completed',
                            style: TextStyle(color: Colors.grey, fontSize: 12)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Health Tips Room
          const Text(
            'Personalized Health Guidelines',
            style: TextStyle(
                color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _tips.length,
            itemBuilder: (ctx, idx) {
              final isExpanded = _expandedTipIndex == idx;
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[800]!),
                ),
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.lightbulb_outline,
                          color: Colors.amber),
                      title: Text(
                        _tips[idx]['title']!,
                        style: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.w600),
                      ),
                      trailing: Icon(
                        isExpanded ? Icons.expand_less : Icons.expand_more,
                        color: Colors.grey,
                      ),
                      onTap: () {
                        setState(() {
                          _expandedTipIndex = isExpanded ? -1 : idx;
                        });
                      },
                    ),
                    if (isExpanded)
                      Padding(
                        padding: const EdgeInsets.only(
                            left: 16.0, right: 16.0, bottom: 16.0),
                        child: Text(
                          _tips[idx]['body']!,
                          style: const TextStyle(
                              color: Colors.grey, height: 1.4, fontSize: 13),
                        ),
                      ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
