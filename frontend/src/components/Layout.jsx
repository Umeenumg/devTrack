import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout({ children, title }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div style={{
        marginLeft: '240px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Navbar */}
        <Navbar title={title} />

        {/* Page content */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
        }}>
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;