// JavaScript code to fetch and display user data

// Function to fetch user data from the server with pagination
function fetchUsers(page, pageSize) {
    // Replace this URL with your actual API endpoint to fetch user data
    const apiUrl = `../api/user/all?page=${page}&pageSize=${pageSize}`;

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
            updatePaginator(data["data"].paging.total, data["data"].totalUsers); // Assuming the API returns pagination metadata
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


// Function to render users in the table
function renderUsers(data) {
    console.log(data);
    if (data.users.length === 0) {
        console.error('No users found');
        return;
    }

    const userTableBody = document.getElementById('userTableBody');
    const userCount = document.getElementById('user-count');

    userCount.textContent = data.totalCount + ' total';

    // Clear existing table rows
    userTableBody.innerHTML = '';

    // Loop through each user and create a table row for each
    data.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
            <div class="main__table-text">${user.id}</div>
            </td>
            <td>
                <div class="main__user">
                    <div class="main__avatar">
                        <img src="../img/user.svg" alt="" class="white">
                    </div>
                    <div class="main__meta">
                        <h3>${user.username}</h3>
                        <span>${user.email}</span>
                    </div>
                </div>
            </td>
            <td><div class="main__table-text">${user.username}</div></td>
            <td><div class="main__table-text">${user.createdDate}</div></td>
            <td>
                <div class="main__table-btns">
                    <!-- Add action buttons here -->
                </div>
            </td>
        `;

        // Append the row to the table body
        userTableBody.appendChild(row);
    });
}

// Function to update the paginator
function updatePaginator(totalPages, totalUsers) {
    const paginatorPages = document.querySelector('.paginator__pages');
    paginatorPages.textContent = `${totalPages} from ${totalUsers}`;

    const paginatorList = document.querySelector('.paginator__paginator');
    paginatorList.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
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
const pageSize = 10;



if (document.getElementById('userTableBody') && document.getElementById('user-count')){
    // Call fetchUsers with default page and pageSize when the page loads
    window.onload = () => fetchUsers(defaultPage, pageSize);
}
