// Tạo scene, camera và renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Thiết lập nền của scene thành trắng
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-model').appendChild(renderer.domElement);

// Ánh sáng
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Ánh sáng môi trường mạnh
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Ánh sáng chiếu sáng mạnh
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100); // Ánh sáng điểm
pointLight.position.set(0, 2, 0);
scene.add(pointLight);

// Tải mô hình GLB
const loader = new THREE.GLTFLoader();
loader.load('3d-model.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(3, 3, 3); // Điều chỉnh kích thước mô hình lớn hơn
    model.position.set(0, -1, 0); // Điều chỉnh vị trí mô hình trong scene

    // Duyệt qua các vật liệu của mô hình và thêm ánh sáng
    model.traverse(function (child) {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Đặt vật liệu cơ bản
        }
    });

    scene.add(model);
    console.log("Mô hình đã tải thành công!");
}, undefined, function (error) {
    console.error("Lỗi khi tải mô hình:", error);
});

// Cài đặt camera
camera.position.set(0, 1, 5); // Điều chỉnh vị trí camera
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Điều khiển camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minDistance = 2;
controls.maxDistance = 10;

// Vòng lặp render
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();


// Hiển thị thông báo
function showMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    messageContainer.innerText = message;
    document.body.appendChild(messageContainer);

    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => messageContainer.remove(), 3000);
}

// Xử lý form chung
function handleFormSubmission(event, formId, successMessage, errorMessage, resetForm = false) {
    event.preventDefault();
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    let isValid = true;

    formData.forEach(value => {
        if (!value) {
            isValid = false;
        }
    });

    if (isValid) {
        showMessage(successMessage);
        if (resetForm) form.reset();
    } else {
        showMessage(errorMessage);
    }
}

// Gán sự kiện cho các form
document.getElementById('loginForm').addEventListener('submit', (event) => 
    handleFormSubmission(event, 'loginForm', `Đăng nhập thành công với email: ${document.getElementById('email').value}`, 'Vui lòng điền đầy đủ thông tin!')
);

document.getElementById('registerForm').addEventListener('submit', (event) => 
    handleFormSubmission(event, 'registerForm', 'Đăng ký thành công! Bạn có thể đăng nhập ngay.', 'Vui lòng điền đầy đủ thông tin!', true)
);

document.getElementById('reminderForm').addEventListener('submit', (event) => 
    handleFormSubmission(event, 'reminderForm', `Lịch nhắc nhở: ${document.getElementById('reminderTask').value} vào lúc ${document.getElementById('reminderTime').value}`, 'Vui lòng điền đầy đủ thông tin lịch nhắc nhở!')
);

document.getElementById('healthConditionForm').addEventListener('submit', (event) => 
    handleFormSubmission(event, 'healthConditionForm', `Thông tin bệnh: ${document.getElementById('healthIssue').value}. Triệu chứng: ${document.getElementById('symptoms').value}`, 'Vui lòng nhập đầy đủ thông tin bệnh và triệu chứng!')
);

document.getElementById('accountForm').addEventListener('submit', (event) => 
    handleFormSubmission(event, 'accountForm', 'Thông tin tài khoản đã được cập nhật thành công!', 'Vui lòng điền đầy đủ thông tin tài khoản!')
);
