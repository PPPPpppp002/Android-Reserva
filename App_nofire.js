import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setCalendarVisible(true); // Muestra el calendario
  };

  const handleConfirmReservation = () => {
    setCalendarVisible(false);
    setConfirmationVisible(true); // Muestra el mensaje de confirmación
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reserva tu Espacio</Text>

      <View style={styles.grid}>
        {Array.from({ length: 20 }, (_, i) => (
          <TouchableOpacity
            key={i}
            style={styles.placeButton}
            onPress={() => handleSelectPlace(i + 1)}
          >
            <Text style={styles.placeText}>{i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

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