import 'package:flutter/material.dart';

class BillingScreen extends StatefulWidget {
  const BillingScreen({super.key});

  @override
  State<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends State<BillingScreen> {
  final List<Map<String, dynamic>> _invoices = [
    {
      'id': 'inv-1',
      'date': '22 Jun 2026',
      'amount': 25.0,
      'status': 'PAID',
      'method': 'M-Pesa',
    },
    {
      'id': 'inv-2',
      'date': '22 May 2026',
      'amount': 25.0,
      'status': 'PAID',
      'method': 'Card',
    }
  ];

  String _selectedMethod = 'MPESA'; // MPESA, CARD, BANK
  final TextEditingController _phoneController =
      TextEditingController(text: '0712345678');
  final TextEditingController _cardNameController = TextEditingController();
  final TextEditingController _cardNumberController = TextEditingController();
  bool _isProcessing = false;

  void _processPayment() {
    setState(() {
      _isProcessing = true;
    });

    // Simulate payment transaction clearing
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _isProcessing = false;
        _invoices.insert(0, {
          'id':
              'inv-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
          'date': 'Today',
          'amount': 25.0,
          'status': 'PAID',
          'method': _selectedMethod == 'MPESA'
              ? 'M-Pesa'
              : _selectedMethod == 'CARD'
                  ? 'Card'
                  : 'Bank Transfer',
        });
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Payment processed successfully. Membership active!'),
          backgroundColor: Color(0xFF0D9488),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Membership & Billing'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Plan overview card
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
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Active Plan',
                      style: TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                          fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('Premium Patient Care',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold)),
                  SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Price: \$25.00 / month',
                          style: TextStyle(color: Colors.grey, fontSize: 13)),
                      Text('Renews: 22 Jul 2026',
                          style: TextStyle(
                              color: Color(0xFF0D9488),
                              fontWeight: FontWeight.bold,
                              fontSize: 13)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Payment gateways selection
            const Text(
              'Renew Membership Subscription',
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[800]!),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildMethodButton('MPESA', 'M-Pesa'),
                      _buildMethodButton('CARD', 'Card'),
                      _buildMethodButton('BANK', 'Bank Transfer'),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Dynamic payment form
                  if (_selectedMethod == 'MPESA') ...[
                    TextField(
                      controller: _phoneController,
                      style: const TextStyle(color: Colors.white),
                      keyboardType: TextInputType.phone,
                      decoration: _buildInputDecoration(
                          'M-Pesa Phone Number', Icons.phone),
                    ),
                  ] else if (_selectedMethod == 'CARD') ...[
                    TextField(
                      controller: _cardNameController,
                      style: const TextStyle(color: Colors.white),
                      decoration: _buildInputDecoration(
                          'Cardholder Name', Icons.person),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _cardNumberController,
                      style: const TextStyle(color: Colors.white),
                      keyboardType: TextInputType.number,
                      decoration: _buildInputDecoration(
                          'Card Number', Icons.credit_card),
                    ),
                  ] else ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.grey[900],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Bank: Afya Flow Holding Bank',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text('Account: 1022-9908-1122',
                              style:
                                  TextStyle(color: Colors.grey, fontSize: 12)),
                          Text('Ref Code: PAT-SER-88',
                              style: TextStyle(
                                  color: Color(0xFF0D9488),
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ],

                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: _isProcessing ? null : _processPayment,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0D9488),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8)),
                      ),
                      child: _isProcessing
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Authorize Payment (\$25.00)',
                              style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Billing history logs
            const Text(
              'Payment History Receipts',
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _invoices.length,
              itemBuilder: (ctx, idx) {
                final inv = _invoices[idx];
                return Card(
                  color: const Color(0xFF1E293B),
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  child: ListTile(
                    leading: const Icon(Icons.receipt_long,
                        color: Color(0xFF0D9488)),
                    title: Text(
                        '\$${inv['amount'].toStringAsFixed(2)} - ${inv['method']}',
                        style: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold)),
                    subtitle: Text('Date: ${inv['date']} | ID: ${inv['id']}',
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 12)),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text('PAID',
                          style: TextStyle(
                              color: Colors.green,
                              fontSize: 10,
                              fontWeight: FontWeight.bold)),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMethodButton(String method, String label) {
    final isSelected = _selectedMethod == method;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedMethod = method),
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 4),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFF0D9488).withOpacity(0.15)
                : Colors.transparent,
            border: Border.all(
              color: isSelected ? const Color(0xFF0D9488) : Colors.grey[800]!,
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.grey,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 12,
              ),
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _buildInputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.grey, fontSize: 13),
      prefixIcon: Icon(icon, color: Colors.grey, size: 18),
      filled: true,
      fillColor: const Color(0xFF0F172A),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Color(0xFF0D9488), width: 1.5),
      ),
    );
  }
}
