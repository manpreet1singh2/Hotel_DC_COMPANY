// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Interfaces basadas en tu base de datos
export interface DatabaseRoom {
  id_habitacion: number
  numero_habitacion: number
  tipo_habitacion: 'Sencilla' | 'Doble' | 'Suite'
  precio: number
  estado_habitacion: 'Disponible' | 'Ocupada' | 'Mantenimiento'
  descripcion?: string
  capacidad?: number
  servicios_incluidos?: string
}

export interface Room {
  id: string
  number: string
  tipo: 'Sencilla' | 'Doble' | 'Suite'
  precio: number
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento'
  descripcion?: string
  capacidad?: number
  servicios_incluidos?: string
  // Campos adicionales para compatibilidad
  name?: string
  image?: string
  isAvailable?: boolean
  amenities?: string[]
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  // Campos adicionales para compatibilidad
  nombre_servicio?: string
  descripcion_servicio?: string
  precio_servicio?: number
  disponible?: boolean
}

// Interfaces para usuarios
export interface DatabaseUser {
  id_usuario: number
  correo_usuario: string
  usuario_acceso: 'Cliente' | 'Empleado'
  estado_usuario: 'Activo' | 'Inactivo'
  fecha_registro: string
  contraseña_usuario: string
  nombre_cliente?: string
  apellido_cliente?: string
  telefono_cliente?: string
  direccion_cliente?: string
  nacionalidad?: string
  nombre_empleado?: string
  apellido_empleado?: string
  cargo_empleado?: string
  telefono_empleado?: string
  fecha_contratacion?: string
}

export interface User {
  id: string
  email: string
  role: string
  status: string
  registration_date: string
  name: string
  last_name: string
  phone: string
  address?: string
  nationality?: string
  position?: string
  hire_date?: string
}

// Interfaces para empleados
export interface DatabaseEmployee {
  id_empleado: number
  nombre_empleado: string
  apellido_empleado: string
  correo_empleado: string
  telefono_empleado: string
  cargo_empleado: string
  fecha_contratacion: string
  estado_usuario?: string
}

export interface Employee {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  cargo: string
  fecha_contratacion: string
  estado?: string
  nombre_completo?: string
}

// Interfaces para reservas
export interface DatabaseReservation {
  id_reserva: number
  fecha_reserva: string
  fecha_inicio: string
  fecha_fin: string
  estado_reserva: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada'
  id_cliente: number
  id_empleado: number
  id_habitacion: number
}

export interface Reservation {
  id: string
  booking_date: string
  start_date: string
  end_date: string
  status: string
  client: {
    id: number
    name: string
    email: string
    phone: string
    address?: string
    nationality?: string
  }
  room: {
    id: number
    number: string
    type: string
    price: number
  }
  details: {
    total_cost: number
    checkin?: string
    checkout?: string
  }
  employee?: string
  services?: Array<{
    id: string
    name: string
    description: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

// Función segura para acceder a localStorage (solo en cliente)
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    return null
  }
}

// Función segura para establecer localStorage (solo en cliente)
const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

// Función segura para remover localStorage (solo en cliente)
const removeLocalStorageItem = (key: string): void => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing localStorage:', error)
  }
}

// Función auxiliar para obtener headers con autenticación - MEJORADA
function getAuthHeaders(): HeadersInit {
  const token = getLocalStorageItem('accessToken')
  const userStr = getLocalStorageItem('user')
  
  console.log('🔐 Auth Debug - getAuthHeaders:', {
    token: token ? `Present (${token.substring(0, 20)}...)` : 'Missing',
    hasUser: !!userStr,
    user: userStr ? JSON.parse(userStr) : 'No user data'
  })
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// Función para verificar si el usuario actual es admin/empleado
export function isCurrentUserAdmin(): boolean {
  try {
    const userStr = getLocalStorageItem('user')
    if (!userStr) {
      console.log('❌ No user found in localStorage')
      return false
    }
    
    const user = JSON.parse(userStr)
    console.log('👤 Current user for admin check:', {
      email: user.correo_usuario || user.email,
      usuario_acceso: user.usuario_acceso,
      role: user.role,
      cargo_empleado: user.cargo_empleado,
      nombre: user.nombre_empleado || user.nombre_cliente,
      id_usuario: user.id_usuario,
      id_empleado: user.id_empleado
    })
    
    // Cualquier empleado es considerado admin para el frontend
    const isAdmin = (
      user?.usuario_acceso === 'Empleado' ||
      user?.role === 'Empleado' ||
      user?.cargo_empleado !== undefined ||
      user?.id_empleado !== undefined
    )
    
    console.log('🔐 Admin check result:', isAdmin)
    return isAdmin
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Función para manejar errores de conexión y autenticación
function handleApiError(error: any, context: string): never {
  console.error(`❌ Error in ${context}:`, error)
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:5000')
  }
  
  if (error.message.includes('Failed to fetch')) {
    throw new Error('Error de conexión. Verifica que el servidor esté funcionando.')
  }
  
  throw error
}

// Función para manejar respuestas de error del backend - MEJORADA
async function handleResponseError(response: Response, skipAuthCheck: boolean = false): Promise<never> {
  const errorText = await response.text()
  console.error('❌ Backend error response:', {
    status: response.status,
    statusText: response.statusText,
    errorText,
    skipAuthCheck
  })
  
  let errorMessage = errorText || `Error ${response.status}: ${response.statusText}`
  
  try {
    const errorData = JSON.parse(errorText)
    errorMessage = errorData.error || errorData.message || errorMessage
  } catch {
    // Si no es JSON, usar el texto plano
  }
  
  // Si es error 401, manejar autenticación
  if (response.status === 401) {
    console.log('⚠️ Error 401 - Sesión expirada o no autenticado')
    
    // Limpiar datos de autenticación
    removeLocalStorageItem('accessToken')
    removeLocalStorageItem('refreshToken')
    removeLocalStorageItem('user')
    
    // Redirigir al login si estamos en el cliente
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
      }, 1000)
    }
    
    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
  }
  
  throw new Error(errorMessage)
}

// FUNCIÓN AUXILIAR PARA LIMPIAR DATOS PROFUNDAMENTE - MEJORADA
function deepCleanData(data: any): any {
  if (data === null || data === undefined) {
    return null
  }
  
  if (Array.isArray(data)) {
    const cleanedArray = data.map(item => deepCleanData(item)).filter(item => item !== undefined && item !== null)
    return cleanedArray.length > 0 ? cleanedArray : null
  }
  
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: any = {}
    let hasValidFields = false
    
    for (const [key, value] of Object.entries(data)) {
      const cleanedValue = deepCleanData(value)
      if (cleanedValue !== undefined && cleanedValue !== null) {
        cleaned[key] = cleanedValue
        hasValidFields = true
      }
    }
    
    return hasValidFields ? cleaned : null
  }
  
  // Para valores primitivos, retornar tal cual
  return data
}

// FUNCIÓN ESPECÍFICA PARA LIMPIAR DATOS DE RESERVA - MEJORADA
function cleanReservationData(data: any): any {
  console.log('🧹 Original reservation data:', data)
  
  // Primero hacemos una limpieza profunda
  const cleaned = deepCleanData(data)
  console.log('🧹 After deep cleaning:', cleaned)
  
  // Si después de la limpieza todo es null, retornar null
  if (!cleaned) {
    console.log('⚠️ All data was cleaned to null')
    return null
  }
  
  // Luego aseguramos los tipos y valores por defecto
  const finalData = {
    room_id: cleaned.room_id ? parseInt(cleaned.room_id) : null,
    start_date: cleaned.start_date || null,
    end_date: cleaned.end_date || null,
    services: Array.isArray(cleaned.services) ? cleaned.services.map((service: any) => ({
      id_servicio: service.id_servicio ? parseInt(service.id_servicio) : null,
      cantidad: service.cantidad ? parseInt(service.cantidad.toString()) : 1,
      precio_total: service.precio_total ? parseFloat(service.precio_total.toString()) : 0
    })).filter((service: any) => service.id_servicio !== null && !isNaN(service.id_servicio)) : [],
    guests: cleaned.guests ? parseInt(cleaned.guests.toString()) : 1,
    total_price: cleaned.total_price ? parseFloat(cleaned.total_price.toString()) : 0,
    special_requests: cleaned.special_requests || null
  }

  // Validación final para asegurar que no hay undefined
  Object.keys(finalData).forEach(key => {
    if (finalData[key] === undefined) {
      finalData[key] = null
    }
  })

  console.log('✅ Final cleaned reservation data:', finalData)
  return finalData
}

// FUNCIONES PARA EMPLEADOS
export async function getEmployees(): Promise<Employee[]> {
  try {
    console.log('📡 Fetching employees from:', `${API_BASE_URL}/employees`)
    
    const response = await fetch(`${API_BASE_URL}/employees`, {
      headers: getAuthHeaders(),
    })
    
    console.log('📡 Employees response status:', response.status)
    
    if (!response.ok) {
      return handleResponseError(response)
    }
    
    const data = await response.json()
    console.log('✅ Employees data received:', data)
    
    // Mapear datos de la base de datos al formato del frontend
    return (data.employees || []).map((emp: DatabaseEmployee) => ({
      id: emp.id_empleado.toString(),
      nombre: emp.nombre_empleado,
      apellido: emp.apellido_empleado,
      email: emp.correo_empleado,
      telefono: emp.telefono_empleado || '',
      cargo: emp.cargo_empleado,
      fecha_contratacion: emp.fecha_contratacion,
      estado: emp.estado_usuario || 'Activo',
      nombre_completo: `${emp.nombre_empleado} ${emp.apellido_empleado}`
    }))
    
  } catch (error) {
    return handleApiError(error, 'getEmployees')
  }
}

export async function getEmployeeById(id: string): Promise<Employee> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: getAuthHeaders(),
    })
    
    if (!response.ok) {
      return handleResponseError(response)
    }
    
    const data = await response.json()
    const emp = data.employee
    
    return {
      id: emp.id_empleado.toString(),
      nombre: emp.nombre_empleado,
      apellido: emp.apellido_empleado,
      email: emp.correo_empleado,
      telefono: emp.telefono_empleado || '',
      cargo: emp.cargo_empleado,
      fecha_contratacion: emp.fecha_contratacion,
      estado: emp.estado_usuario || 'Activo',
      nombre_completo: `${emp.nombre_empleado} ${emp.apellido_empleado}`
    }
  } catch (error) {
    return handleApiError(error, 'getEmployeeById')
  }
}

export async function createEmployee(employeeData: Omit<Employee, 'id' | 'nombre_completo'>): Promise<Employee> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para crear empleados')
    }

    console.log('🔄 Attempting to create employee with data:', employeeData)
    
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        nombre_empleado: employeeData.nombre,
        apellido_empleado: employeeData.apellido,
        correo_empleado: employeeData.email,
        telefono_empleado: employeeData.telefono,
        cargo_empleado: employeeData.cargo,
        fecha_contratacion: employeeData.fecha_contratacion,
        contraseña: '1234' // Contraseña por defecto
      }),
    })

    console.log('📡 Create employee response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }

    const result = await response.json()
    console.log('✅ Created employee result:', result)
    
    const emp = result.employee
    return {
      id: emp.id_empleado.toString(),
      nombre: emp.nombre_empleado,
      apellido: emp.apellido_empleado,
      email: emp.correo_empleado,
      telefono: emp.telefono_empleado || '',
      cargo: emp.cargo_empleado,
      fecha_contratacion: emp.fecha_contratacion,
      estado: emp.estado_usuario || 'Activo',
      nombre_completo: `${emp.nombre_empleado} ${emp.apellido_empleado}`
    }
    
  } catch (error) {
    return handleApiError(error, 'createEmployee')
  }
}

export async function updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para actualizar empleados')
    }

    console.log('🔄 Attempting to update employee:', id, employeeData)
    
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        nombre_empleado: employeeData.nombre,
        apellido_empleado: employeeData.apellido,
        telefono_empleado: employeeData.telefono,
        cargo_empleado: employeeData.cargo,
        fecha_contratacion: employeeData.fecha_contratacion
      }),
    })

    console.log('📡 Update employee response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }

    const result = await response.json()
    console.log('✅ Update employee result:', result)
    
    // Obtener el empleado actualizado
    return await getEmployeeById(id)
    
  } catch (error) {
    return handleApiError(error, 'updateEmployee')
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para eliminar empleados')
    }

    console.log('🔄 Attempting to delete employee:', id)
    
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    console.log('📡 Delete employee response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }
    
    console.log('✅ Employee deleted successfully')
  } catch (error) {
    return handleApiError(error, 'deleteEmployee')
  }
}

export async function updateEmployeeStatus(id: string, status: string): Promise<void> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para cambiar el estado de empleados')
    }

    const response = await fetch(`${API_BASE_URL}/employees/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      return handleResponseError(response)
    }
    
    console.log('✅ Employee status updated successfully')
  } catch (error) {
    return handleApiError(error, 'updateEmployeeStatus')
  }
}

// FUNCIONES PARA RESERVAS
export async function getReservations(): Promise<Reservation[]> {
  try {
    console.log('📡 Fetching reservations from:', `${API_BASE_URL}/reservations`)
    
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      headers: getAuthHeaders(),
    })
    
    console.log('📡 Reservations response status:', response.status)
    
    if (!response.ok) {
      return handleResponseError(response)
    }
    
    const data = await response.json()
    console.log('✅ Reservations data received:', data)
    
    return data.reservations || []
    
  } catch (error) {
    return handleApiError(error, 'getReservations')
  }
}

export async function getReservationById(id: string): Promise<Reservation> {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      headers: getAuthHeaders(),
    })
    
    if (!response.ok) {
      return handleResponseError(response)
    }
    
    const data = await response.json()
    return data.reservation
  } catch (error) {
    return handleApiError(error, 'getReservationById')
  }
}

// FUNCIÓN CREATE RESERVATION MEJORADA - CON MEJOR MANEJO DE AUTENTICACIÓN
export async function createReservation(reservationData: any): Promise<any> {
  try {
    // Verificar autenticación primero
    const userStr = getLocalStorageItem('user')
    const token = getLocalStorageItem('accessToken')
    
    console.log('🔐 Authentication check for reservation:', {
      hasUser: !!userStr,
      hasToken: !!token,
      user: userStr ? JSON.parse(userStr) : null
    })

    if (!userStr || !token) {
      throw new Error('Debes iniciar sesión para crear una reserva. Redirigiendo al login...')
    }

    const user = JSON.parse(userStr)
    console.log('👤 User creating reservation:', {
      email: user.correo_usuario || user.email,
      role: user.usuario_acceso || user.role,
      id: user.id_usuario || user.id
    })

    // LIMPIAR Y VALIDAR DATOS ANTES DE ENVIAR
    const cleanedData = cleanReservationData(reservationData)

    // Validar que los campos requeridos no estén vacíos
    if (!cleanedData || !cleanedData.room_id || !cleanedData.start_date || !cleanedData.end_date) {
      throw new Error('Datos de reserva incompletos. Verifica la habitación y las fechas.')
    }

    // Asegurar que no haya undefined en ningún campo
    const finalData = {
      room_id: cleanedData.room_id,
      start_date: cleanedData.start_date,
      end_date: cleanedData.end_date,
      services: cleanedData.services || [],
      guests: cleanedData.guests || 1,
      total_price: cleanedData.total_price || 0,
      special_requests: cleanedData.special_requests || null
    }

    console.log('🔄 Attempting to create reservation with final data:', finalData)
    console.log('🔐 Using token:', token ? `Present (${token.substring(0, 20)}...)` : 'Missing')
    
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(finalData),
    })

    console.log('📡 Create reservation response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }

    const result = await response.json()
    console.log('✅ Created reservation result:', result)
    
    return result
    
  } catch (error: any) {
    console.error('❌ Error in createReservation:', error)
    
    // Si es error de autenticación, redirigir al login
    if (error.message.includes('sesión') || error.message.includes('autenticado') || error.message.includes('login')) {
      // Limpiar datos de autenticación
      removeLocalStorageItem('accessToken')
      removeLocalStorageItem('refreshToken')
      removeLocalStorageItem('user')
      
      // Redirigir al login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
      }
    }
    
    throw error
  }
}

export async function updateReservation(id: string, reservationData: any): Promise<any> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para actualizar reservas')
    }

    console.log('🔄 Attempting to update reservation:', id, reservationData)
    
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reservationData),
    })

    console.log('📡 Update reservation response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }

    const result = await response.json()
    console.log('✅ Update reservation result:', result)
    
    return result
    
  } catch (error) {
    return handleApiError(error, 'updateReservation')
  }
}

export async function deleteReservation(id: string): Promise<void> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para eliminar reservas')
    }

    console.log('🔄 Attempting to delete reservation:', id)
    
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    console.log('📡 Delete reservation response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }
    
    console.log('✅ Reservation deleted successfully')
  } catch (error) {
    return handleApiError(error, 'deleteReservation')
  }
}

export async function updateReservationStatus(id: string, status: string): Promise<void> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para cambiar el estado de reservas')
    }

    const response = await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      return handleResponseError(response)
    }
    
    console.log('✅ Reservation status updated successfully')
  } catch (error) {
    return handleApiError(error, 'updateReservationStatus')
  }
}

export async function cancelReservation(id: string): Promise<void> {
  try {
    // Permitir tanto a clientes como administradores cancelar reservas
    const userStr = getLocalStorageItem('user')
    if (!userStr) {
      throw new Error('Debes iniciar sesión para cancelar una reserva')
    }

    const response = await fetch(`${API_BASE_URL}/reservations/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      return handleResponseError(response)
    }
    
    console.log('✅ Reservation cancelled successfully')
  } catch (error) {
    return handleApiError(error, 'cancelReservation')
  }
}

// FUNCIONES PARA USUARIOS
export async function getUsers(): Promise<User[]> {
  try {
    console.log('📡 Fetching users from:', `${API_BASE_URL}/users`)
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    })
    
    console.log('📡 Users response status:', response.status)
    
    if (!response.ok) {
      return handleResponseError(response)
    }
    
    const data = await response.json()
    console.log('✅ Users data received:', data)
    
    return data.users || []
    
  } catch (error) {
    return handleApiError(error, 'getUsers')
  }
}

export async function getUserById(id: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    })
    
    if (!response.ok) {
      return handleResponseError(response)
    }
    
    const data = await response.json()
    return data.user
  } catch (error) {
    return handleApiError(error, 'getUserById')
  }
}

export async function createUser(userData: any): Promise<User> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para crear usuarios')
    }

    console.log('🔄 Attempting to create user with data:', userData)
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })

    console.log('📡 Create user response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }

    const result = await response.json()
    console.log('✅ Created user result:', result)
    
    return result.user
    
  } catch (error) {
    return handleApiError(error, 'createUser')
  }
}

export async function updateUser(id: string, userData: any): Promise<User> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para actualizar usuarios')
    }

    console.log('🔄 Attempting to update user:', id, userData)
    
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })

    console.log('📡 Update user response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }

    const result = await response.json()
    console.log('✅ Update user result:', result)
    
    return result.user
    
  } catch (error) {
    return handleApiError(error, 'updateUser')
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para eliminar usuarios')
    }

    console.log('🔄 Attempting to delete user:', id)
    
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    console.log('📡 Delete user response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }
    
    console.log('✅ User deleted successfully')
  } catch (error) {
    return handleApiError(error, 'deleteUser')
  }
}

export async function updateUserStatus(id: string, status: string): Promise<void> {
  try {
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para cambiar el estado de usuarios')
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      return handleResponseError(response)
    }
    
    console.log('✅ User status updated successfully')
  } catch (error) {
    return handleApiError(error, 'updateUserStatus')
  }
}

// FUNCIONES PARA HABITACIONES
export async function getRooms(): Promise<Room[]> {
  try {
    console.log('📡 Fetching rooms from:', `${API_BASE_URL}/rooms`)
    
    // Para las habitaciones, no requerimos autenticación ya que los clientes
    // necesitan verlas sin estar logueados
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    // Solo agregar token si existe, pero no es requerido
    const token = getLocalStorageItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/rooms`, {
      headers,
    })
    
    console.log('📡 Rooms response status:', response.status)
    
    if (!response.ok) {
      // Si es error 401, usar datos de respaldo en lugar de lanzar error
      if (response.status === 401) {
        console.log('⚠️ No autenticado para ver habitaciones, usando datos de respaldo')
        return getFallbackRooms()
      }
      
      // Para otros errores, intentar sin autenticación
      console.log('⚠️ Error al obtener habitaciones, intentando sin autenticación...')
      try {
        const responseWithoutAuth = await fetch(`${API_BASE_URL}/rooms`, {
          headers: {
            'Content-Type': 'application/json'
          },
        })
        
        if (responseWithoutAuth.ok) {
          const data = await responseWithoutAuth.json()
          console.log('✅ Rooms data received (without auth):', data)
          
          const roomsArray = data.rooms || data.data || data
          return mapRoomsData({ rooms: Array.isArray(roomsArray) ? roomsArray : [] })
        }
      } catch (fallbackError) {
        console.log('⚠️ Fallback también falló, usando datos locales')
      }
      
      // Si todo falla, usar datos de respaldo
      return getFallbackRooms()
    }
    
    const data = await response.json()
    console.log('✅ Rooms data received:', data)
    
    // Manejar tanto la respuesta antigua (con paginación) como la nueva (sin paginación)
    const roomsArray = data.rooms || data.data || data
    return mapRoomsData({ rooms: Array.isArray(roomsArray) ? roomsArray : [] })
    
  } catch (error) {
    console.error('❌ Error in getRooms:', error)
    
    // En caso de cualquier error, retornar datos de respaldo
    console.log('🔄 Using fallback room data due to error')
    return getFallbackRooms()
  }
}

// Función para obtener habitaciones de respaldo cuando el servidor no está disponible
function getFallbackRooms(): Room[] {
  console.log('🔄 Using fallback room data')
  const fallbackRooms = [
    {
      id: '1',
      number: '101',
      tipo: 'Sencilla',
      precio: 150,
      estado: 'Disponible',
      descripcion: 'Comfortable single room with individual bed, desk, and TV.',
      capacidad: 1,
      servicios_incluidos: 'WiFi, TV, Air Conditioning',
      name: 'Standard Room - Single',
      isAvailable: true,
      amenities: ['WiFi', 'TV', 'Air Conditioning'],
      image: '/standard-room-bedroom.jpg'
    },
    {
      id: '2',
      number: '102',
      tipo: 'Doble',
      precio: 220,
      estado: 'Disponible',
      descripcion: 'Spacious double room with two beds and minibar.',
      capacidad: 2,
      servicios_incluidos: 'WiFi, TV, Air Conditioning, Minibar',
      name: 'Deluxe Room - Double',
      isAvailable: true,
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Minibar'],
      image: '/deluxe-room-bedroom.jpg'
    },
    {
      id: '3',
      number: '103',
      tipo: 'Suite',
      precio: 450,
      estado: 'Disponible',
      descripcion: 'Luxury suite with living area, balcony and jacuzzi.',
      capacidad: 4,
      servicios_incluidos: 'WiFi, TV, Jacuzzi, Balcony, Minibar',
      name: 'Presidential Suite',
      isAvailable: true,
      amenities: ['WiFi', 'TV', 'Jacuzzi', 'Balcony', 'Minibar'],
      image: '/luxury-suite-bedroom.jpg'
    },
    {
      id: '4',
      number: '104',
      tipo: 'Sencilla',
      precio: 150,
      estado: 'Disponible',
      descripcion: 'Comfortable single room with all essential amenities.',
      capacidad: 1,
      servicios_incluidos: 'WiFi, TV, Air Conditioning',
      name: 'Standard Room 104',
      isAvailable: true,
      amenities: ['WiFi', 'TV', 'Air Conditioning'],
      image: '/standard-room-bedroom.jpg'
    },
    {
      id: '5',
      number: '105',
      tipo: 'Doble',
      precio: 220,
      estado: 'Disponible',
      descripcion: 'Habitación doble con dos camas y minibar.',
      capacidad: 2,
      servicios_incluidos: 'WiFi, TV, Aire acondicionado, Minibar',
      name: 'Habitación 105 - Doble',
      isAvailable: true,
      amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar'],
      image: ''
    }
  ]

  console.log('✅ Fallback rooms without external images:', fallbackRooms)
  return fallbackRooms
}

// Función auxiliar para mapear datos de habitaciones
function mapRoomsData(data: any): Room[] {
  console.log('📋 Mapping rooms data:', data)
  
  // Manejar diferentes formatos de respuesta
  let roomsArray = data.rooms || data.data || data
  
  if (!Array.isArray(roomsArray)) {
    console.warn('⚠️ No rooms array found in response, using empty array')
    roomsArray = []
  }
  
  // Adaptar la respuesta del backend con manejo seguro de propiedades
  const mappedRooms = roomsArray.map((room: any, index: number) => {
    try {
      // Validar campos requeridos con valores por defecto
      const idHabitacion = room.id_habitacion || room.id || `temp-${index}`
      const numeroHabitacion = room.numero_habitacion || room.numero || room.numero_habitacion || `000${index}`
      const tipoHabitacion = room.tipo_habitacion || room.tipo || 'Sencilla'
      const precio = room.precio !== undefined ? room.precio : 150000
      const estadoHabitacion = room.estado_habitacion || room.estado || 'Disponible'
      
      return {
        id: idHabitacion.toString(),
        number: numeroHabitacion.toString(),
        tipo: tipoHabitacion,
        precio: typeof precio === 'number' ? precio : parseFloat(precio) || 150000,
        estado: estadoHabitacion,
        descripcion: room.descripcion || '',
        capacidad: room.capacidad || 2,
        servicios_incluidos: room.servicios_incluidos || '',
        name: `Habitación ${numeroHabitacion} - ${tipoHabitacion}`,
        isAvailable: estadoHabitacion === 'Disponible',
        amenities: room.servicios_incluidos ? 
          (typeof room.servicios_incluidos === 'string' ? 
            room.servicios_incluidos.split(', ') : 
            room.servicios_incluidos) : 
          [],
        image: '' // Remover la dependencia de placeholder
      }
    } catch (error) {
      console.error(`❌ Error mapping room ${index}:`, error, room)
      return null
    }
  }).filter((room: Room | null): room is Room => room !== null)
  
  console.log('✅ Mapped rooms:', mappedRooms)
  return mappedRooms
}

export async function getRoomById(id: string): Promise<Room> {
  try {
    // Para rooms individuales, tampoco requerimos autenticación obligatoria
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    const token = getLocalStorageItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      headers,
    })
    
    if (!response.ok) {
      // Si hay error, buscar en datos de respaldo
      const fallbackRooms = getFallbackRooms()
      const fallbackRoom = fallbackRooms.find(room => room.id === id)
      if (fallbackRoom) {
        console.log('✅ Found room in fallback data:', fallbackRoom)
        return fallbackRoom
      }
      throw new Error(`Habitación ${id} no encontrada`)
    }
    
    const roomData = await response.json()
    const room = roomData.room || roomData

    // Validar campos requeridos con valores por defecto
    const idHabitacion = room.id_habitacion || room.id || id
    const numeroHabitacion = room.numero_habitacion || room.numero || '000'
    const tipoHabitacion = room.tipo_habitacion || room.tipo || 'Sencilla'
    const precio = room.precio !== undefined ? room.precio : 150000
    const estadoHabitacion = room.estado_habitacion || room.estado || 'Disponible'

    return {
      id: idHabitacion.toString(),
      number: numeroHabitacion.toString(),
      tipo: tipoHabitacion,
      precio: typeof precio === 'number' ? precio : parseFloat(precio) || 150000,
      estado: estadoHabitacion,
      descripcion: room.descripcion || '',
      capacidad: room.capacidad || 2,
      servicios_incluidos: room.servicios_incluidos || '',
      name: `Habitación ${numeroHabitacion} - ${tipoHabitacion}`,
      isAvailable: estadoHabitacion === 'Disponible',
      amenities: room.servicios_incluidos ? 
        (typeof room.servicios_incluidos === 'string' ? 
          room.servicios_incluidos.split(', ') : 
          room.servicios_incluidos) : 
        [],
      image: '' // Remover la dependencia de placeholder
    }
  } catch (error) {
    console.error('Error getting room by id:', error)
    // Buscar en datos de respaldo
    const fallbackRooms = getFallbackRooms()
    const fallbackRoom = fallbackRooms.find(room => room.id === id)
    if (fallbackRoom) {
      return fallbackRoom
    }
    throw new Error(`Habitación ${id} no disponible`)
  }
}

export async function createRoom(roomData: Omit<DatabaseRoom, 'id_habitacion'>): Promise<Room> {
  try {
    // Verificar permisos de administrador
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para crear habitaciones')
    }

    console.log('🔄 Attempting to create room with data:', roomData)
    console.log('📡 Sending to:', `${API_BASE_URL}/rooms`)
    
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData),
    })

    console.log('📡 Create room response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }

    const result = await response.json()
    console.log('✅ Created room result:', result)
    
    // Si el backend devuelve solo roomId, obtener la habitación completa
    if (result.roomId && !result.room) {
      return await getRoomById(result.roomId.toString())
    }
    
    return mapSingleRoom(result.room || result)
    
  } catch (error) {
    return handleApiError(error, 'createRoom')
  }
}

export async function updateRoom(id: string, roomData: Partial<DatabaseRoom>): Promise<Room> {
  try {
    // Verificar permisos de administrador
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para actualizar habitaciones')
    }

    console.log('🔄 Attempting to update room:', id, roomData)
    console.log('📡 Sending to:', `${API_BASE_URL}/rooms/${id}`)
    
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData),
    })

    console.log('📡 Update room response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }

    const result = await response.json()
    console.log('✅ Update room result:', result)
    
    // Obtener la habitación actualizada
    return await getRoomById(id)
    
  } catch (error) {
    return handleApiError(error, 'updateRoom')
  }
}

export async function deleteRoom(id: string): Promise<void> {
  try {
    // Verificar permisos de administrador
    if (!isCurrentUserAdmin()) {
      throw new Error('No tienes permisos de administrador para eliminar habitaciones')
    }

    console.log('🔄 Attempting to delete room:', id)
    console.log('📡 Sending to:', `${API_BASE_URL}/rooms/${id}`)
    
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    console.log('📡 Delete room response status:', response.status)

    if (!response.ok) {
      return handleResponseError(response)
    }
    
    console.log('✅ Room deleted successfully')
  } catch (error) {
    return handleApiError(error, 'deleteRoom')
  }
}

// Función auxiliar para mapear una sola habitación
function mapSingleRoom(room: any): Room {
  return {
    id: (room.id_habitacion || room.id).toString(),
    number: (room.numero_habitacion || room.numero).toString(),
    tipo: room.tipo_habitacion || room.tipo,
    precio: typeof room.precio === 'number' ? room.precio : parseFloat(room.precio) || 0,
    estado: room.estado_habitacion || room.estado,
    descripcion: room.descripcion || '',
    capacidad: room.capacidad || 2,
    servicios_incluidos: room.servicios_incluidos || '',
    name: `Habitación ${room.numero_habitacion || room.numero} - ${room.tipo_habitacion || room.tipo}`,
    isAvailable: (room.estado_habitacion || room.estado) === 'Disponible',
    amenities: room.servicios_incluidos ? 
      (typeof room.servicios_incluidos === 'string' ? 
        room.servicios_incluidos.split(', ') : 
        room.servicios_incluidos) : 
      [],
    image: '' // Remover la dependencia de placeholder
  }
}

// FUNCIONES PARA DISPONIBILIDAD
export async function checkRoomAvailability(checkIn: string, checkOut: string, guests?: number): Promise<Room[]> {
  try {
    const params = new URLSearchParams({
      fecha_inicio: checkIn,
      fecha_fin: checkOut
    })
    if (guests) params.append('huespedes', guests.toString())

    // No requerir autenticación para consultar disponibilidad
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    const token = getLocalStorageItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/rooms/availability?${params.toString()}`, {
      headers,
    })

    if (!response.ok) {
      // Si hay error, devolver todas las habitaciones como disponibles
      console.log('⚠️ Error checking availability, returning all rooms as available')
      return await getRooms()
    }

    const data = await response.json()
    
    if (!data.available_rooms || !Array.isArray(data.available_rooms)) {
      return await getRooms()
    }
    
    return data.available_rooms.map((room: any) => ({
      id: (room.id_habitacion || room.id).toString(),
      number: (room.numero_habitacion || room.numero).toString(),
      tipo: room.tipo_habitacion || room.tipo,
      precio: typeof room.precio === 'number' ? room.precio : parseFloat(room.precio) || 0,
      estado: room.estado_habitacion || room.estado,
      descripcion: room.descripcion || '',
      capacidad: room.capacidad || 2,
      servicios_incluidos: room.servicios_incluidos || '',
      name: `Habitación ${room.numero_habitacion || room.numero}`,
      isAvailable: true,
      amenities: room.servicios_incluidos ? 
        (typeof room.servicios_incluidos === 'string' ? 
          room.servicios_incluidos.split(', ') : 
          room.servicios_incluidos) : 
        []
    }))
  } catch (error) {
    console.error('Error checking availability:', error)
    // En caso de error, devolver todas las habitaciones
    return await getRooms()
  }
}

// FUNCIONES PARA SERVICIOS
export async function getServices(): Promise<Service[]> {
  try {
    // No requerir autenticación para servicios
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    const token = getLocalStorageItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers,
    })
    
    if (!response.ok) {
      // Si hay error, devolver servicios de respaldo
      return getFallbackServices()
    }
    
    const data = await response.json()
    
    return data.services?.map((service: any) => ({
      id: service.id_servicio?.toString() || service.id?.toString(),
      name: service.nombre_servicio || service.name,
      description: service.descripcion_servicio || service.description,
      price: parseFloat(service.precio_servicio || service.price),
      category: getServiceCategory(service.nombre_servicio || service.name),
      image: '/service-placeholder.jpg',
      nombre_servicio: service.nombre_servicio,
      descripcion_servicio: service.descripcion_servicio,
      precio_servicio: parseFloat(service.precio_servicio || service.price),
      disponible: service.disponible !== false
    })) || getFallbackServices()
  } catch (error) {
    console.error('Error fetching services:', error)
    return getFallbackServices()
  }
}

// Servicios de respaldo
function getFallbackServices(): Service[] {
  return [
    {
      id: '1',
      name: 'Desayuno',
      description: 'Servicio de desayuno buffet',
      price: 20000,
      category: 'Alimentación',
      image: '/service-placeholder.jpg'
    },
    {
      id: '2',
      name: 'Spa',
      description: 'Servicio de spa y relajación',
      price: 80000,
      category: 'Bienestar',
      image: '/service-placeholder.jpg'
    },
    {
      id: '3',
      name: 'Transporte',
      description: 'Servicio de transporte al aeropuerto',
      price: 50000,
      category: 'Transporte',
      image: '/service-placeholder.jpg'
    }
  ]
}

export async function getServiceById(id: string): Promise<Service> {
  try {
    // No requerir autenticación para servicios individuales
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    const token = getLocalStorageItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      headers,
    })
    
    if (!response.ok) {
      // Buscar en servicios de respaldo
      const fallbackServices = getFallbackServices()
      const fallbackService = fallbackServices.find(service => service.id === id)
      if (fallbackService) {
        return fallbackService
      }
      throw new Error(`Servicio ${id} no encontrado`)
    }
    
    const service = await response.json()

    return {
      id: service.id_servicio?.toString() || service.id?.toString(),
      name: service.nombre_servicio || service.name,
      description: service.descripcion_servicio || service.description,
      price: parseFloat(service.precio_servicio || service.price),
      category: getServiceCategory(service.nombre_servicio || service.name),
      image: '/service-placeholder.jpg',
      nombre_servicio: service.nombre_servicio,
      descripcion_servicio: service.descripcion_servicio,
      precio_servicio: parseFloat(service.precio_servicio || service.price),
      disponible: service.disponible !== false
    }
  } catch (error) {
    console.error('Error fetching service:', error)
    // Buscar en servicios de respaldo
    const fallbackServices = getFallbackServices()
    const fallbackService = fallbackServices.find(service => service.id === id)
    if (fallbackService) {
      return fallbackService
    }
    throw error
  }
}

export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const allServices = await getServices()
    return allServices.slice(0, 6)
  } catch (error) {
    console.error('Error fetching featured services:', error)
    return getFallbackServices().slice(0, 3)
  }
}

function getServiceCategory(serviceName: string): string {
  const name = serviceName.toLowerCase()
  
  if (name.includes('desayuno') || name.includes('almuerzo') || name.includes('cena')) {
    return 'Alimentación'
  } else if (name.includes('spa') || name.includes('masaje')) {
    return 'Bienestar'
  } else if (name.includes('transporte') || name.includes('tour')) {
    return 'Transporte'
  } else if (name.includes('lavandería') || name.includes('limpieza') || name.includes('lavanderia')) {
    return 'Limpieza'
  } else if (name.includes('llamada') || name.includes('internet') || name.includes('wifi')) {
    return 'Comunicaciones'
  } else if (name.includes('gimnasio') || name.includes('piscina')) {
    return 'Recreación'
  } else {
    return 'Otros'
  }
}

// Función para obtener el usuario actual
export function getCurrentUser(): any {
  try {
    const userStr = getLocalStorageItem('user')
    if (!userStr) {
      console.log('❌ No user found in localStorage')
      return null
    }
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Función para cerrar sesión
export function logout(): void {
  removeLocalStorageItem('accessToken')
  removeLocalStorageItem('refreshToken')
  removeLocalStorageItem('user')
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login'
  }
}

// Función para verificar autenticación
export function isAuthenticated(): boolean {
  const token = getLocalStorageItem('accessToken')
  const user = getLocalStorageItem('user')
  
  console.log('🔐 Authentication check:', {
    hasToken: !!token,
    hasUser: !!user,
    token: token ? `Present (${token.substring(0, 20)}...)` : 'Missing'
  })
  
  return !!token && !!user
}