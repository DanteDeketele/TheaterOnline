// JavaScript code to fetch and display user data

// Function to fetch user data from the server with pagination
function fetchUsers(page, pageSize, searchValue = '') {
    // Replace this URL with your actual API endpoint to fetch user data
    const apiUrl = `/api/user/all?page=${page}&pageSize=${pageSize}&search=${searchValue}`;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Call the function to render users in the table
            renderUsers(data["data"]); // Assuming the API returns an object with a "users" property containing the user data
            updatePaginator(data["data"].paging); // Assuming the API returns pagination metadata
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


// Function to render users in the table
function renderUsers(data) {
    
    
    const userTableBody = document.getElementById('userTableBody');
    const userCount = document.getElementById('user-count');

    userCount.textContent = data.totalCount + ' total';

    // Clear existing table rows
    userTableBody.innerHTML = '';
if (data.users.length === 0) {
        return;
    }

    // Loop through each user and create a table row for each
    data.users.forEach(user => {
        const row = document.createElement('tr');

        // Parse registration date and format it
        const registrationDate = new Date(user.register_date);
        const formattedDate = registrationDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const promoteText = user.is_admin ? 'Demote' : 'Promote';
        const promoteClass = user.is_admin ? 'demote' : 'promote';

        row.innerHTML = `
            <td>
            <div class="main__table-text id">${user.id}</div>
            </td>
            <td>
                <div class="main__user">
                    <div class="main__avatar">
                        <img src="/img/user.svg" alt="" class="white">
                    </div>
                    <div class="main__meta">
                        <h3>${user.username}</h3>
                        <span>${user.email}</span>
                    </div>
                </div>
            </td>
            <td><div class="main__table-text">${user.username}</div></td>
            <td><div class="main__table-text">${formattedDate}</div></td>
            <td>
                <div class="main__table-btns">
                    <button class="edit-user-btn" data-user-id="${user.id}">Edit</button>
                    <button class="delete-user-btn" data-user-id="${user.id}">Delete</button>
                    <button class="${promoteClass}-user-btn" data-user-id="${user.id}">${promoteText}</button>
                </div>
            </td>
        `;

        // Append the row to the table body
        userTableBody.appendChild(row);
    });
}

// Function to update the paginator
function updatePaginator(paging) {
    const paginatorPages = document.querySelector('.paginator__pages');
    paginatorPages.textContent = `${paging["current"]} from ${paging["total"]}`;

    const paginatorList = document.querySelector('.paginator__paginator');
    paginatorList.innerHTML = '';

    for (let i = 1; i <= paging["total"]; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-page="${i}">${i}</a>`;
        li.addEventListener('click', handlePageClick);
        paginatorList.appendChild(li);
    }
}

// Function to handle page click event
function handlePageClick(event) {
    event.preventDefault();
    const page = event.target.dataset.page;
    fetchUsers(page, pageSize); // Assuming pageSize is defined elsewhere
}

// Assuming you have a default page and pageSize
const defaultPage = 1;
const pageSize = 15;

// Select the search input field
const searchInput = document.getElementById('searchInput');

if (searchInput) {
    // Attach an event listener to the input field
    searchInput.addEventListener('input', function() {
        // Get the current value of the search input
        const searchValue = searchInput.value.trim();

        // Call a function to update the search with the new value
        updateSearch(searchValue);
    });
}

// Function to update the search with the new value
function updateSearch(searchValue) {
    fetchUsers(defaultPage, pageSize, searchValue);
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-user-btn')) {
        const userId = event.target.dataset.userId;
        // Make an API call to delete the user using the userId
        fetch(`/api/user/delete/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            // Handle response, maybe refresh the user list
            console.log('User deleted successfully');
            fetchUsers(defaultPage, pageSize, searchInput.value.trim());
            // Call a function to refresh the user list if needed
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    }
    if (event.target.classList.contains('edit-user-btn')) {
        const userId = event.target.dataset.userId;
        
        // Redirect to the edit user page with the userId
        window.location.href = `/admin/users/${userId}`;
    }
    if (event.target.classList.contains('promote-user-btn')) {
        const userId = event.target.dataset.userId;
        // Make an API call to promote the user using the userId
        fetch(`/api/user/promote/${userId}`, {
            method: 'PUT'
        })
        .then(response => {
            // Handle response, maybe refresh the user list
            console.log('User promoted successfully');
            fetchUsers(defaultPage, pageSize, searchInput.value.trim());
            // Call a function to refresh the user list if needed
        })
        .catch(error => {
            console.error('Error promoting user:', error);
        });
    }
    if (event.target.classList.contains('demote-user-btn')) {
        const userId = event.target.dataset.userId;
        // Make an API call to demote the user using the userId
        fetch(`/api/user/demote/${userId}`, {
            method: 'PUT'
        })
        .then(response => {
            // Handle response, maybe refresh the user list
            console.log('User demoted successfully');
            fetchUsers(defaultPage, pageSize, searchInput.value.trim());
            // Call a function to refresh the user list if needed
        })
        .catch(error => {
            console.error('Error demoting user:', error);
        });
    }
});


if (document.getElementById('userTableBody') && document.getElementById('user-count')){
    // Call fetchUsers with default page and pageSize when the page loads
    window.onload = () => fetchUsers(defaultPage, pageSize);
}
