import { db } from './firebase/config'; // Ajusta la ruta si es diferente
import { collection, addDoc, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [reservasOcupadas, setReservasOcupadas] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  // Obtener las reservas cuando la app cargue
  useEffect(() => {
    const cargarReservas = async () => {
      const reservas = await obtenerReservas();
      setReservasOcupadas(reservas);
    };
    cargarReservas();
  }, []);

  // Función para guardar la reserva en Firebase
  const guardarReserva = async (lugar, fecha) => {
    try {
      await addDoc(collection(db, 'reservas'), {
        lugar: lugar,
        fecha: fecha,
        timestamp: new Date(),
      });
      console.log('Reserva guardada con éxito');
    } catch (e) {
      console.error('Error al guardar la reserva: ', e);
      alert('Hubo un error al guardar la reserva.');
    }
  };

  // Función para obtener las reservas de Firebase
  const obtenerReservas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reservas'));
      let reservas = [];
      querySnapshot.forEach((doc) => {
        reservas.push(doc.data());
      });
      return reservas;
    } catch (e) {
      console.error('Error al obtener reservas: ', e);
      return [];
    }
  };

  // Función para manejar la selección de la fecha
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Función para manejar la selección del lugar
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setShowCalendar(true); // Muestra el calendario al seleccionar un lugar
  };

  // Obtener fechas reservadas
  const getReservedDates = () => {
    return reservasOcupadas.map((reserva) => reserva.fecha); // Regresa un array con las fechas reservadas
  };

  // Función para confirmar la reserva
  const handleConfirmReservation = () => {
    if (!selectedPlace || !selectedDate) {
      Alert.alert('Error', 'Por favor selecciona un lugar y una fecha antes de confirmar.');
      return;
    }

    // Llamar a la función para guardar la reserva
    guardarReserva(selectedPlace, selectedDate);

    // Mostrar modal de confirmación
    setConfirmationVisible(true);

    // Resetear estado
    setSelectedPlace(null);
    setSelectedDate(null);
    setCalendarVisible(false);

    Alert.alert('Reserva confirmada', 'Tu lugar ha sido reservado exitosamente');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Cuadrícula de lugares */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[...Array(10)].map((_, index) => {
          const lugar = index + 1; // Los lugares son del 1 al 10
          const estaOcupado = reservasOcupadas.some((reserva) => reserva.lugar === lugar);

          return (
            <Button
              key={lugar}
              title={`Lugar ${lugar}`}
              onPress={() => handleSelectPlace(lugar)}
              disabled={estaOcupado} // Desactivar si está ocupado
            />
          );
        })}
      </View>

      {/* Si el calendario debe mostrarse */}
      {showCalendar && (
        <Calendar
          onDayPress={(day) => handleDateChange(day.dateString)} // Cambia la fecha seleccionada
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' },
          }}
          disabledDates={getReservedDates()} // Deshabilitar fechas reservadas
        />
      )}

      {/* Botón para confirmar la reserva */}
      <Button title="Confirmar reserva" onPress={handleConfirmReservation} />

      {/* Modal de Calendario */}
      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecciona una fecha para el lugar #{selectedPlace}
            </Text>

            <Calendar
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: 'blue' },
              }}
              onDayPress={(day) => setSelectedDate(day.dateString)}
            />

            <Button title="Confirmar reserva" onPress={handleConfirmReservation} />
            <Button title="Cancelar" onPress={() => setCalendarVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal visible={confirmationVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Reserva creada con éxito!</Text>
            <Button title="Cerrar" onPress={() => setConfirmationVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  placeButton: {
    width: 60,
    height: 60,
    backgroundColor: '#4DA8DA',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    borderRadius: 10,
  },
  placeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});