import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeePortal.css';

const EmployeePortal = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const employeeName = user ? `${user.firstName} ${user.lastName}` : "Employee";

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('https://localhost:3001/user/transactions', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again later.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleValidation = async (transactionId, status) => {
    try {
      const response = await axios.patch(
        `https://localhost:3001/user/transactions/${transactionId}/validate`,
        { status },
        {
          headers: { 'Authorization': `Bearer ${user.token}` }
        }
      );

      console.log(response.data.message);

      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, status }
            : transaction
        )
      );
    } catch (error) {
      console.error("Error updating transaction status:", error);
      alert("Failed to update transaction status. Please try again later.");
    }
  };

  const pendingTransactions = transactions.filter(transaction => transaction.status === 'Pending');
  const verifiedTransactions = transactions.filter(transaction => transaction.status !== 'Pending');

  return (
    <div className="employee-portal">
      <header className="portal-header">
        <h1>Welcome, {employeeName}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="transactions-section">
        <h2>All Transactions</h2>
        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="transactions-container">
            {/* Verified Transactions Column */}
            <div className="transactions-column">
              <h3>Verified Transactions</h3>
              {verifiedTransactions.length > 0 ? (
                verifiedTransactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-tile verified">
                    <h3>{transaction.recipient}</h3>
                    <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
                    <p><strong>Amount:</strong> 
                      {transaction.amount 
                        ? parseFloat(transaction.amount).toFixed(2) 
                        : 'N/A'} {transaction.currency}
                    </p>
                    <p><strong>Account Number:</strong> {transaction.accountNumber}</p>
                    <p><strong>Status:</strong> {transaction.status || 'Verified'}</p>
                    <p><strong>Type:</strong> {transaction.type}</p>
                  </div>
                ))
              ) : (
                <p>No verified transactions.</p>
              )}
            </div>

            {/* Pending Transactions Column */}
            <div className="transactions-column">
              <h3>Pending Transactions</h3>
              {pendingTransactions.length > 0 ? (
                pendingTransactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-tile pending">
                    <h3>{transaction.recipient}</h3>
                    <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
                    <p><strong>Amount:</strong> 
                      {transaction.amount 
                        ? parseFloat(transaction.amount).toFixed(2) 
                        : 'N/A'} {transaction.currency}
                    </p>
                    <p><strong>Account Number:</strong> {transaction.accountNumber}</p>
                    <p><strong>Status:</strong> {transaction.status || 'Pending'}</p>
                    <p><strong>Type:</strong> {transaction.type}</p>

                    <div className="transaction-actions">
                      <button 
                        className="approve-button" 
                        onClick={() => handleValidation(transaction._id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button 
                        className="reject-button" 
                        onClick={() => handleValidation(transaction._id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No pending transactions.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeePortal;
