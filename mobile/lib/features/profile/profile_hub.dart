import 'package:flutter/material.dart';

class ProfileHub extends StatelessWidget {
  final Map<String, dynamic> patientData;
  final VoidCallback onLogout;
  final VoidCallback onNavigateToBilling;

  const ProfileHub({
    super.key,
    required this.patientData,
    required this.onLogout,
    required this.onNavigateToBilling,
  });

  @override
  Widget build(BuildContext context) {
    final vitals = patientData['vitals'];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Profile Header card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey[850]!),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: const Color(0xFF0D9488),
                  child: Text(
                    patientData['name'].substring(0, 2).toUpperCase(),
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        patientData['name'],
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        patientData['email'],
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Vitals Grid Section
          const Text(
            'Recent Clinical Vitals',
            style: TextStyle(
                color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.3,
            children: [
              _buildVitalCard('Blood Pressure', vitals['bloodPressure'],
                  Icons.favorite, Colors.redAccent),
              _buildVitalCard('Heart Pulse', '${vitals['heartRate']} bpm',
                  Icons.bolt, Colors.orangeAccent),
              _buildVitalCard('Blood Glucose', '${vitals['bloodSugar']} mg/dL',
                  Icons.scale, Colors.cyanAccent),
              _buildVitalCard('Daily Diet Plan', patientData['mealPlan'],
                  Icons.restaurant, const Color(0xFF0D9488)),
            ],
          ),
          const SizedBox(height: 24),

          // Account Options
          const Text(
            'Account Settings',
            style: TextStyle(
                color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[800]!),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.payment, color: Colors.grey),
                  title: const Text('Membership & Invoices',
                      style: TextStyle(color: Colors.white, fontSize: 14)),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: onNavigateToBilling,
                ),
                Divider(color: Colors.grey[800], height: 1),
                const ListTile(
                  leading: Icon(Icons.shield_outlined, color: Colors.grey),
                  title: Text('Security & HIPAA Compliance',
                      style: TextStyle(color: Colors.white, fontSize: 14)),
                  trailing: Icon(Icons.chevron_right, color: Colors.grey),
                ),
                Divider(color: Colors.grey[800], height: 1),
                const ListTile(
                  leading: Icon(Icons.chat_bubble_outline, color: Colors.grey),
                  title: Text('Contact Support Lead',
                      style: TextStyle(color: Colors.white, fontSize: 14)),
                  trailing: Icon(Icons.chevron_right, color: Colors.grey),
                ),
                Divider(color: Colors.grey[800], height: 1),
                ListTile(
                  leading: const Icon(Icons.logout, color: Colors.redAccent),
                  title: const Text('Sign Out',
                      style: TextStyle(
                          color: Colors.redAccent,
                          fontSize: 14,
                          fontWeight: FontWeight.bold)),
                  onTap: onLogout,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVitalCard(
      String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[850]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title,
                  style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 11,
                      fontWeight: FontWeight.w600)),
              Icon(icon, color: color, size: 16),
            ],
          ),
          Text(
            value,
            style: const TextStyle(
                color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            overflow: TextOverflow.ellipsis,
            maxLines: 2,
          ),
        ],
      ),
    );
  }
}
