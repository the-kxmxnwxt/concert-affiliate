FROM golang:1.24.1-alpine

WORKDIR /app

# Copy ก่อน: go.mod + go.sum
COPY go.mod ./
COPY go.sum ./

# โหลด dependencies
RUN go mod download

# Copy ส่วนที่เหลือทั้งหมด
COPY . .

# Build จากไฟล์ใน cmd/
RUN go build -o main ./cmd

EXPOSE 8080

CMD ["./main"]
