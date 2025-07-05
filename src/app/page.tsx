import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

export default function HomePage() {
  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">💸 Personal Finance Tracker</h1>

      {/* Add New Transaction */}
      <TransactionForm />

      {/* List All Transactions */}
      <TransactionList />
    </main>
  );
}
