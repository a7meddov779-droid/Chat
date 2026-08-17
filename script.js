const API_BASE = 'https://al-coral.vercel.app';

// ========== عرض الأقسام ==========
function showSection(id) {
    document.querySelectorAll('.section').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// ========== إنشاء مستخدم ==========
async function createUser() {
    const name = document.getElementById('userName').value.trim();
    const result = document.getElementById('createResult');

    if (!name) {
        result.innerHTML = '<span class="error">❌ الرجاء إدخال الاسم</span>';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/create-user?name=${encodeURIComponent(name)}`);
        const data = await res.json();

        if (data.success) {
            result.innerHTML = `
                <span class="success">✅ تم إنشاء المستخدم بنجاح</span>
                <div class="result-box">
                    🆔 المعرف: <strong>${data.user.id}</strong><br>
                    👤 الاسم: ${data.user.name}
                </div>
            `;
            document.getElementById('userName').value = '';
        } else {
            result.innerHTML = `<span class="error">❌ ${data.error}</span>`;
        }
    } catch (e) {
        result.innerHTML = `<span class="error">❌ خطأ في الاتصال</span>`;
    }
}

// ========== عرض المستخدمين ==========
async function loadUsers() {
    const result = document.getElementById('usersResult');

    try {
        const res = await fetch(`${API_BASE}/users`);
        const data = await res.json();

        if (data.success && data.users.length > 0) {
            let html = `<div class="result-box">`;
            data.users.forEach(u => {
                html += `
                    <div class="user-item">
                        <span>👤 ${u.name}</span>
                        <span class="id">🆔 ${u.id}</span>
                    </div>
                `;
            });
            html += `<br>📌 *إجمالي:* ${data.total}</div>`;
            result.innerHTML = html;
        } else {
            result.innerHTML = `<div class="result-box">❌ لا يوجد مستخدمين</div>`;
        }
    } catch (e) {
        result.innerHTML = `<span class="error">❌ خطأ في الاتصال</span>`;
    }
}

// ========== إرسال رسالة ==========
async function sendMessage() {
    const from = document.getElementById('fromId').value.trim();
    const to = document.getElementById('toId').value.trim();
    const message = document.getElementById('msgText').value.trim();
    const result = document.getElementById('sendResult');

    if (!from || !to || !message) {
        result.innerHTML = '<span class="error">❌ جميع الحقول مطلوبة</span>';
        return;
    }

    if (from.length !== 8 || to.length !== 8) {
        result.innerHTML = '<span class="error">❌ المعرف يجب أن يكون 8 أرقام</span>';
        return;
    }

    try {
        const res = await fetch(
            `${API_BASE}/send-message?from=${from}&to=${to}&message=${encodeURIComponent(message)}`
        );
        const data = await res.json();

        if (data.success) {
            result.innerHTML = `
                <span class="success">✅ تم إرسال الرسالة</span>
                <div class="result-box">
                    من: ${data.data.fromName} (${data.data.from})<br>
                    إلى: ${data.data.toName} (${data.data.to})<br>
                    📝 ${data.data.message}
                </div>
            `;
            document.getElementById('msgText').value = '';
        } else {
            result.innerHTML = `<span class="error">❌ ${data.error}</span>`;
        }
    } catch (e) {
        result.innerHTML = `<span class="error">❌ خطأ في الاتصال</span>`;
    }
}

// ========== عرض رسائلي ==========
async function loadMessages() {
    const userId = document.getElementById('myId').value.trim();
    const result = document.getElementById('messagesResult');

    if (!userId) {
        result.innerHTML = '<span class="error">❌ الرجاء إدخال معرفك</span>';
        return;
    }

    if (userId.length !== 8) {
        result.innerHTML = '<span class="error">❌ المعرف يجب أن يكون 8 أرقام</span>';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/messages/${userId}`);
        const data = await res.json();

        if (data.success) {
            if (data.messages.length === 0) {
                result.innerHTML = `<div class="result-box">📭 لا يوجد رسائل</div>`;
                return;
            }

            let html = `<div class="result-box">`;
            data.messages.forEach(msg => {
                html += `
                    <div class="message-item">
                        <div class="from">👤 ${msg.fromName} (${msg.from})</div>
                        <div class="text">📝 ${msg.message}</div>
                        <div class="time">📅 ${new Date(msg.timestamp).toLocaleString('ar-EG')}</div>
                        <div>${msg.read ? '✅ مقروءة' : '🕐 غير مقروءة'}</div>
                    </div>
                `;
            });
            html += `<br>📌 *إجمالي:* ${data.total}</div>`;
            result.innerHTML = html;
        } else {
            result.innerHTML = `<span class="error">❌ ${data.error}</span>`;
        }
    } catch (e) {
        result.innerHTML = `<span class="error">❌ خطأ في الاتصال</span>`;
    }
}

// ========== عرض الإحصائيات ==========
async function loadStats() {
    const result = document.getElementById('statsResult');

    try {
        const res = await fetch(`${API_BASE}/users-with-messages`);
        const data = await res.json();

        if (data.success && data.users.length > 0) {
            let html = `<div class="result-box">`;
            data.users.forEach(u => {
                html += `
                    <div class="user-item">
                        <span>👤 ${u.name}</span>
                        <span>📨 ${u.messageCount} رسائل | 🕐 ${u.unreadCount} غير مقروءة</span>
                    </div>
                `;
            });
            html += `<br>📌 *إجمالي النشطاء:* ${data.total}</div>`;
            result.innerHTML = html;
        } else {
            result.innerHTML = `<div class="result-box">📊 لا يوجد مستخدمين نشطين</div>`;
        }
    } catch (e) {
        result.innerHTML = `<span class="error">❌ خطأ في الاتصال</span>`;
    }
}

// ========== تحميل أولي ==========
showSection('create');
