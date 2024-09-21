// import React, { useState } from 'react';
// import { View, Button, Platform, Text } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const TimePicker = ({ onTimeSelected }) => {
//     const [showPicker, setShowPicker] = useState(false);
//     const [selectedTime, setSelectedTime] = useState(null);

//     const onChange = (event, selectedDate) => {
//         setShowPicker(Platform.OS === 'ios');
//         if (selectedDate) {
//             const currentDate = new Date(selectedDate);
//             setSelectedTime(currentDate);
//             onTimeSelected(currentDate);
//         }
//     };

//     return (
//         <View>
//             <Button title="Pick Time" onPress={() => setShowPicker(true)} />
//             {showPicker && (
//                 <DateTimePicker
//                     value={new Date()}
//                     mode="time"
//                     is24Hour={true}
//                     display="default"
//                     onChange={onChange}
//                 />
//             )}
//             {selectedTime && <Text>Selected Time: {selectedTime.toLocaleTimeString()}</Text>}
//         </View>
//     );
// };

// export default TimePicker;
