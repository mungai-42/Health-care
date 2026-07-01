import 'package:flutter/material.dart';

// Import subcomponents
import 'features/auth/onboarding_screens.dart';
import 'features/dashboard/home_dashboard.dart';
import 'features/dashboard/ai_chat_screen.dart';
import 'features/tracking/tracking_hub.dart';
import 'features/clinical/appointments_hub.dart';
import 'features/profile/profile_hub.dart';
import 'features/profile/billing_screen.dart';

void main() {
  runApp(const AfyaFlowApp());
}

class AfyaFlowApp extends StatelessWidget {
  const AfyaFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Premium Calming Healthcare Theme (Dark Slate + Mint Teal Accent)
    final darkMedicalTheme = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate 900
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF0D9488), // Mint Teal
        secondary: Color(0xFF6366F1), // Soft Indigo
        surface: Color(0xFF1E293B), // Slate 800
        background: Color(0xFF0F172A),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF0F172A),
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
            color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xFF0F172A),
        selectedItemColor: Color(0xFF0D9488),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );

    return MaterialApp(
      title: 'Afya Flow Patient Portal',
      theme: darkMedicalTheme,
      debugShowCheckedModeBanner: false,
      home: const SessionCoordinator(),
    );
  }
}

class SessionCoordinator extends StatefulWidget {
  const SessionCoordinator({super.key});

  @override
  State<SessionCoordinator> createState() => _SessionCoordinatorState();
}

class _SessionCoordinatorState extends State<SessionCoordinator> {
  // Navigation State
  String _currentRoute = 'onboarding'; // onboarding, login, register, home
  int _activeBottomTab = 0;

  // Global Interactive Mock State
  final Map<String, dynamic> _patientData = {
    'name': 'Sarah Jenkins',
    'email': 's.jenkins@outlook.com',
    'age': 62,
    'gender': 'Female',
    'vitals': {
      'bloodPressure': '145/95',
      'heartRate': 88,
      'bloodSugar': 110,
    },
    'mealPlan': 'Low Sodium Cardiovascular Diet',
    'waterTarget': 2500,
    'waterDrank': 500,
    'medications': [
      {
        'name': 'Amlodipine 5mg (Hypertension)',
        'time': '08:00 AM',
        'taken': false
      },
      {
        'name': 'Atorvastatin 20mg (Cholesterol)',
        'time': '09:00 PM',
        'taken': false
      },
      {
        'name': 'Aspiriin 81mg (Cardio Protection)',
        'time': '08:00 AM',
        'taken': true
      },
    ],
    'appointments': [
      {
        'id': 'appt-1',
        'doctorName': 'Dr. Sarah Jenkins (Cardiology)',
        'date': '2026-07-02',
        'time': '09:00 AM',
      }
    ],
    'homeVisits': [
      {
        'id': 'visit-1',
        'doctorName': 'Dr. Sarah Jenkins',
        'date': '2026-07-01',
        'time': '04:00 PM',
        'location': '12 Medical Plaza, Appt 4B',
        'status': 'In Progress',
      }
    ]
  };

  // State Mutators
  void _logWater(int amount) {
    setState(() {
      _patientData['waterDrank'] = (_patientData['waterDrank'] as int) + amount;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Logged +${amount}mL water hydration'),
        duration: const Duration(seconds: 1),
        backgroundColor: const Color(0xFF0D9488),
      ),
    );
  }

  void _toggleMedication(String name, bool taken) {
    setState(() {
      final List<dynamic> meds = _patientData['medications'];
      for (var med in meds) {
        if (med['name'] == name) {
          med['taken'] = taken;
        }
      }
    });
  }

  void _requestHomeVisit() {
    setState(() {
      final List<dynamic> visits = _patientData['homeVisits'];
      visits.add({
        'id': 'visit-${DateTime.now().millisecondsSinceEpoch}',
        'doctorName': 'Dr. Sarah Jenkins',
        'date': '2026-07-02',
        'time': '10:00 AM',
        'location': '12 Medical Plaza, Appt 4B',
        'status': 'Assigned',
      });
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Home care visit requested successfully'),
        backgroundColor: Color(0xFF0D9488),
      ),
    );
  }

  // Open notifications sheet
  void _openNotifications() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Clinical System Warnings',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              _buildNotificationItem(
                'Critical BP Flag: Vitals BP 145/95 is higher than normal. Please log blood pressure measurements daily.',
                Icons.warning,
                Colors.redAccent,
              ),
              const SizedBox(height: 12),
              _buildNotificationItem(
                'Next dispatch scheduled today at 04:00 PM with Dr. Sarah Jenkins.',
                Icons.calendar_today,
                const Color(0xFF0D9488),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNotificationItem(String msg, IconData icon, Color color) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            msg,
            style:
                const TextStyle(color: Colors.grey, fontSize: 13, height: 1.4),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    // 1. Onboarding Screen
    if (_currentRoute == 'onboarding') {
      return OnboardingScreen(
          onFinish: () => setState(() => _currentRoute = 'login'));
    }

    // 2. Login Screen
    if (_currentRoute == 'login') {
      return LoginScreen(
        onLoginSuccess: () => setState(() => _currentRoute = 'home'),
        onNavigateToRegister: () => setState(() => _currentRoute = 'register'),
      );
    }

    // 3. Register Screen
    if (_currentRoute == 'register') {
      return RegisterScreen(
        onRegisterSuccess: () => setState(() => _currentRoute = 'home'),
        onNavigateToLogin: () => setState(() => _currentRoute = 'login'),
      );
    }

    // 4. Main Home portal layout (tab navigation)
    final List<Widget> tabs = [
      HomeDashboard(
        patientData: _patientData,
        onNavigateToTracking: () => setState(() => _activeBottomTab = 1),
        onOpenNotifications: _openNotifications,
      ),
      TrackingHub(
        patientData: _patientData,
        onLogWater: _logWater,
        onToggleMedication: _toggleMedication,
      ),
      const AiChatScreen(),
      AppointmentsHub(
        appointments: _patientData['appointments'],
        homeVisits: _patientData['homeVisits'],
        onRequestHomeVisit: _requestHomeVisit,
      ),
      ProfileHub(
        patientData: _patientData,
        onLogout: () => setState(() {
          _currentRoute = 'login';
          _activeBottomTab = 0;
        }),
        onNavigateToBilling: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (ctx) => const BillingScreen()),
        ),
      ),
    ];

    final List<String> tabTitles = [
      'Overview Dashboard',
      'Clinical Tracker',
      'Educational AI Assistant',
      'My Medical Agenda',
      'Health Chart'
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(tabTitles[_activeBottomTab]),
        automaticallyImplyLeading: false,
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: tabs[_activeBottomTab],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _activeBottomTab,
        onTap: (idx) => setState(() => _activeBottomTab = idx),
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined), label: 'Home'),
          BottomNavigationBarItem(
              icon: Icon(Icons.check_box_outlined), label: 'Trackers'),
          BottomNavigationBarItem(
              icon: Icon(Icons.chat_bubble_outline), label: 'AI Chat'),
          BottomNavigationBarItem(
              icon: Icon(Icons.calendar_today_outlined), label: 'Schedules'),
          BottomNavigationBarItem(
              icon: Icon(Icons.person_outline_sharp), label: 'Profile'),
        ],
      ),
    );
  }
}
