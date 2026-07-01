import 'package:flutter/material.dart';

class AiChatScreen extends StatefulWidget {
  const AiChatScreen({super.key});

  @override
  State<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends State<AiChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<Map<String, dynamic>> _messages = [
    {
      'role': 'assistant',
      'text':
          'Hello! I am your Afya Flow Educational Health Assistant. You can ask me about medication side effects, hydration guidelines, healthy eating habits, or generic nutrition tips.\n\n*Note: I cannot diagnose symptoms or prescribe treatments.*',
    }
  ];

  bool _isTyping = false;

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({'role': 'user', 'text': text});
      _messageController.clear();
      _isTyping = true;
    });

    _scrollToBottom();

    // Simulate AI response based on safety prompt parameters
    Future.delayed(const Duration(seconds: 1), () {
      final query = text.toLowerCase();
      String response = '';

      // Safety guard check
      final diagnosisKeywords = [
        'diagnose',
        'fever',
        'chest pain',
        'prescribe',
        'treatment for',
        'cure for',
        'what disease',
        'headache',
        'stomach ache',
        'sick',
      ];

      if (diagnosisKeywords.any((k) => query.contains(k))) {
        response =
            'As an educational assistant, I am not authorized to evaluate symptoms, diagnose disease, or recommend medication prescriptions. Please schedule a clinic consultation or contact your primary organization doctor immediately.';
      } else if (query.contains('side effect') ||
          query.contains('medication') ||
          query.contains('pill')) {
        response = 'Common medication side effects include:\n' +
            '- Hypertension pills (e.g. Amlodipine): May cause ankle swelling, dizziness, or headache.\n' +
            '- Statins: Can cause mild muscle aches.\n' +
            'Consult your physician before changing any dosage times.';
      } else if (query.contains('water') ||
          query.contains('hydrate') ||
          query.contains('hydration')) {
        response = 'Daily hydration advice:\n' +
            '- Seek to consume 2.5L to 3.0L of clean water daily.\n' +
            '- Stable fluid intake improves vascular compliance and decreases heart workload.';
      } else if (query.contains('eat') ||
          query.contains('meal') ||
          query.contains('nutrition') ||
          query.contains('diet')) {
        response = 'Healthy eating guidelines:\n' +
            '- Emphasize high-fiber vegetables, whole wheat grains, and lean poultry.\n' +
            '- Minimize sodium intake (under 1500mg daily) to support heart health.';
      } else {
        response = 'Afya Flow Educational Guide:\n' +
            '- Adhere to the meal plans assigned by your organization dietitian.\n' +
            '- Walk 10-15 minutes after meals to stabilize glucose levels.';
      }

      setState(() {
        _isTyping = false;
        _messages.add({'role': 'assistant', 'text': response});
      });

      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Medical disclaimer bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: Colors.amber.withOpacity(0.1),
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.info_outline, color: Colors.amberAccent, size: 18),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Disclaimer: AI insights are for educational purposes only and do not replace professional diagnosis or prescriptions.',
                    style: TextStyle(
                        color: Colors.amberAccent, fontSize: 11, height: 1.3),
                  ),
                ),
              ],
            ),
          ),

          // Message history list
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (ctx, idx) {
                final msg = _messages[idx];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment:
                      isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    constraints: BoxConstraints(
                        maxWidth: MediaQuery.of(context).size.width * 0.75),
                    decoration: BoxDecoration(
                      color: isUser
                          ? const Color(0xFF0D9488)
                          : const Color(0xFF1E293B),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(12),
                        topRight: const Radius.circular(12),
                        bottomLeft: isUser
                            ? const Radius.circular(12)
                            : const Radius.circular(0),
                        bottomRight: isUser
                            ? const Radius.circular(0)
                            : const Radius.circular(12),
                      ),
                      border:
                          isUser ? null : Border.all(color: Colors.grey[850]!),
                    ),
                    child: Text(
                      msg['text'],
                      style: const TextStyle(
                          color: Colors.white, fontSize: 13, height: 1.4),
                    ),
                  ),
                );
              },
            ),
          ),

          // Typing indicator
          if (_isTyping)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Assistant is typing...',
                  style: TextStyle(
                      color: Colors.grey,
                      fontSize: 11,
                      fontStyle: FontStyle.italic),
                ),
              ),
            ),

          // Input field row
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Ask about side effects, diet, water...',
                      hintStyle:
                          const TextStyle(color: Colors.grey, fontSize: 13),
                      filled: true,
                      fillColor: const Color(0xFF1E293B),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  radius: 22,
                  backgroundColor: const Color(0xFF0D9488),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 18),
                    onPressed: _sendMessage,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
