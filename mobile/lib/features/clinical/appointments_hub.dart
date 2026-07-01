import 'package:flutter/material.dart';

class AppointmentsHub extends StatelessWidget {
  final List<dynamic> appointments;
  final List<dynamic> homeVisits;
  final VoidCallback onRequestHomeVisit;

  const AppointmentsHub({
    super.key,
    required this.appointments,
    required this.homeVisits,
    required this.onRequestHomeVisit,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section 1: Upcoming Clinic Appointments
          const Text(
            'Clinic Consultations',
            style: TextStyle(
                color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          appointments.isEmpty
              ? _buildEmptyState('No upcoming clinical consultations.')
              : ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: appointments.length,
                  itemBuilder: (ctx, idx) {
                    final appt = appointments[idx];
                    return Card(
                      color: const Color(0xFF1E293B),
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      child: ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0D9488).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.calendar_today,
                              color: Color(0xFF0D9488)),
                        ),
                        title: Text(appt['doctorName'],
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold)),
                        subtitle: Text(
                          '${appt['date']} at ${appt['time']}',
                          style:
                              const TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.green.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'Scheduled',
                            style: TextStyle(
                                color: Colors.green,
                                fontSize: 10,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    );
                  },
                ),
          const SizedBox(height: 24),

          // Section 2: Home Visits / Doctor dispatches
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Doctor Home Dispatches',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
              ),
              TextButton.icon(
                icon: const Icon(Icons.add, size: 16, color: Color(0xFF0D9488)),
                label: const Text('Request',
                    style: TextStyle(color: Color(0xFF0D9488), fontSize: 12)),
                onPressed: onRequestHomeVisit,
              ),
            ],
          ),
          const SizedBox(height: 12),
          homeVisits.isEmpty
              ? _buildEmptyState('No active home visit dispatches.')
              : ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: homeVisits.length,
                  itemBuilder: (ctx, idx) {
                    final visit = homeVisits[idx];
                    final isCompleted = visit['status'] == 'Completed';
                    final isInProgress = visit['status'] == 'In Progress';

                    return Card(
                      color: const Color(0xFF1E293B),
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  visit['doctorName'],
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: isCompleted
                                        ? Colors.green.withOpacity(0.15)
                                        : isInProgress
                                            ? Colors.blue.withOpacity(0.15)
                                            : Colors.orange.withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    visit['status'],
                                    style: TextStyle(
                                      color: isCompleted
                                          ? Colors.green
                                          : isInProgress
                                              ? Colors.blue
                                              : Colors.orange,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.access_time,
                                    color: Colors.grey, size: 14),
                                const SizedBox(width: 6),
                                Text(
                                  '${visit['date']} at ${visit['time']}',
                                  style: const TextStyle(
                                      color: Colors.grey, fontSize: 12),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.location_on_outlined,
                                    color: Colors.grey, size: 14),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    visit['location'],
                                    style: const TextStyle(
                                        color: Colors.grey, fontSize: 12),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String msg) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[800]!),
      ),
      child: Center(
        child: Text(
          msg,
          style: const TextStyle(color: Colors.grey, fontSize: 13),
        ),
      ),
    );
  }
}
