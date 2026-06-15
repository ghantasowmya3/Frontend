const API_BASE_URL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('token');

// Auth APIs
export async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        return { code: 500, message: 'Server error' };
    }
}

export async function signup(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        console.error('Signup error:', error);
        return { code: 500, message: 'Server error' };
    }
}

export async function getUserInfo() {
    const token = getToken();
    if (!token) return { code: 401 };
    
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/uinfo`, {
            headers: { 'Token': token }
        });
        return await response.json();
    } catch (error) {
        console.error('GetUserInfo error:', error);
        return { code: 500 };
    }
}

export async function getProfile() {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/profile`, {
            headers: { 'Token': token }
        });
        return await response.json();
    } catch (error) {
        console.error('GetProfile error:', error);
        return { code: 500 };
    }
}

// User Management APIs
export async function getAllUsers(page = 1, size = 10) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/getallusers/${page}/${size}`, {
            headers: { 'Token': token }
        });
        return await response.json();
    } catch (error) {
        return { code: 500, users: [] };
    }
}

export async function saveUser(userData) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/saveuser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Token': token },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        return { code: 500 };
    }
}

export async function updateUser(id, userData) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/updateuser/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Token': token },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        return { code: 500 };
    }
}

export async function deleteUser(id) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/deleteuser/${id}`, {
            method: 'DELETE',
            headers: { 'Token': token }
        });
        return await response.json();
    } catch (error) {
        return { code: 500 };
    }
}

export async function searchUser(keyword) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/authservice/searchuser/${keyword}`, {
            headers: { 'Token': token }
        });
        return await response.json();
    } catch (error) {
        return { code: 500, users: [] };
    }
}

// Student Management APIs
export async function getAllStudents(page = 1, size = 10) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/studentservice/getallstudents/${page}/${size}`, {
            headers: { 'Token': token }
        });
        return await response.json();
    } catch (error) {
        return { code: 500, students: [] };
    }
}

export async function saveStudent(studentData) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/studentservice/savestudent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Token': token },
            body: JSON.stringify(studentData)
        });
        return await response.json();
    } catch (error) {
        return { code: 500 };
    }
}

export async function updateStudent(id, studentData) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/studentservice/updatestudent/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Token': token },
            body: JSON.stringify(studentData)
        });
        return await response.json();
    } catch (error) {
        return { code: 500 };
    }
}

export async function deleteStudent(id) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/studentservice/deletestudent/${id}`, {
            method: 'DELETE',
            headers: { 'Token': token }
        });
        return await response.json();
    } catch (error) {
        return { code: 500 };
    }
}

export async function searchStudent(keyword) {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/studentservice/searchstudent/${keyword}`, {
            headers: { 'Token': token }
        });
        return await response.json();
    } catch (error) {
        return { code: 500, students: [] };
    }
}