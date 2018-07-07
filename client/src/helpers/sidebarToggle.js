const sidebarOpen = () => {
    const sidebarLeft = document.getElementsByClassName('sidebar-left')[0];
    if (sidebarLeft.classList.contains('sidebar-left-closed')) {
      sidebarLeft.classList.remove('sidebar-left-closed');
      sidebarLeft.classList.add('sidebar-left-open');
    }
  };
  
  const sidebarClose = () => {
    const sidebar = document.getElementsByClassName('sidebar-left')[0];
  
    if (sidebar.classList.contains(`sidebar-left-open`)) {
      sidebar.classList.remove(`sidebar-left-open`);
      sidebar.classList.add(`sidebar-left-closed`);
    }
  };
  
  export { sidebarOpen, sidebarClose };