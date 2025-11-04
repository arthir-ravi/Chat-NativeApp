import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "#007bff",
    padding: 15,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  message: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    maxWidth: "75%",
  },
  sent: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  received: {
    backgroundColor: "#e4e4e4",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  messageText: {
    fontSize: 15,
    color: "#000",
  },
  timeText: {
    fontSize: 10,
    marginTop: 3,
    textAlign: "right",
    color: "#666",
  },
  dateLabel: {
    textAlign: "center",
    color: "#555",
    marginVertical: 8,
    fontSize: 12,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginLeft: 10,
  },
});
