

//requires js/utils.js
function test_bv() {
    /* BASIC TESTS - NO EDGE CASES */ 
    //empty array
    let bv = new BitVector(0);
    console.log(bv.toB64()); //0
    bv.append(10, 4);
    console.log(bv.toB64()); //A
    bv.append(10, 4);
    console.log(bv.toB64(), bv.bits); //g2, 170 (0b10 101010)

    bv = new BitVector("");
    console.log(bv.toB64(), bv.bits, bv.length);
    bv.append("A");
    console.log(bv.toB64(), bv.bits); //A
    bv.append("102");
    console.log(bv.toB64(), bv.bits); //A102



    //make sure extra length doesn't do anything
    bv = new BitVector(0);   
    bv.append(10, 5);
    console.log(bv.toB64()); //A
    bv.append(10, 4);
    console.log(bv.toB64(), bv.bits); //a5, 330 (0b101 001010)

    //non-empty array
    bv = new BitVector(32); //100000
    console.log(bv.toB64(), bv.bits); //W, 32 (0b 100000)
    bv.append(1, 1);
    console.log(bv.toB64(), bv.bits); //W1, 96 (0b 1 100000)
    bv.append(10, 4);
    console.log(bv.toB64(), bv.bits); //WL, 1376 (0b 10101 100000)

    bv = new BitVector(7, 2);
    bv.append("ABCDE");
    console.log(bv.toB64(), bv.bits, bv.length); // limqu0, 0b 00 111000 110100 110000 101100 101111

    //bit ops
    console.log(bv.read_bit(7)); //0
    bv.set_bit(7);
    console.log(bv.read_bit(7)); //1
    console.log(bv.toB64(), bv.bits); //WN , 1504 (0b 10111 100000)
    bv.clear_bit(7);
    console.log(bv.read_bit(7)); //0


    /* SIMPLE EDGE CASE TESTS*/

    // string -> 3 ints
    bv = new BitVector("a1s2d3f4A9XJKw-m");
    console.log(bv.toB64(), bv.bits, bv.length);
    bv.append("M+LKeoxZJ0JELW0x");
    console.log(bv.toB64(), bv.bits, bv.length);


    //full int
    bv = new BitVector(4294967295);
    console.log(bv.toB64(), bv.bits, bv.length); //-----3, 4294967295, (0b 11 111111 111111 111111 111111 111111)

    //append single bit to full int
    bv.append(1, 1);
    console.log(bv.toB64(), bv.bits, bv.length); //-----7, [4294967295, 1], (0b 111 1s...)


    //append full int to full int to full int
    bv = new BitVector(4294967295);
    bv.append(4294967280); 
    console.log(bv.toB64(), bv.bits, bv.length); // -----3----F, [4294967295, 4294967280], (0b 1111 1....1 000011 111111 ...)
    bv.append(4294967167); 
    console.log(bv.toB64(), bv.bits, bv.length); // -----3-----V----, [4294967295, 4294967280, 4294967167, 0] (0b 1...1 011111 1....1 000011 111111)


    /* BIG TESTS */
    bv = new BitVector(12341234); //(0b 101111 000100 111111 110010)
    console.log(bv.toB64(), bv.bits, bv.length); // o-4l, 12341234 (0b 101111 000100 111111 110010)
    console.log(bv.slice(10, 15)); //19 (100 11)
    bv.append(4113241323); //(0b 11 110101 001010 110001 010011 101011)
    bv.append(2213461274); //(0b 1000 001111 101110 101111 010001 1010)
    bv.append(1273491384); //(0b 10010 111110 011111 101111 101110 00)
    bv.append(1828394744); //(0b 110110 011111 011000 101101 111100 0)
    bv.append(1938417329); //(0b 1 110011 100010 011110 011010 110001)
    console.log(bv.toB64(), bv.bits, bv.length); //o -4lhJn ArhHlk F8klV+ IuRn+i 5hv9E7
    
    bv = new BitVector("");
    bv_2 = new BitVector("a1s2d3f4A9XJKw-m");
    console.log(bv_2.toB64(), bv_2.bits, bv_2.length);
    bv.append(bv_2);
    console.log(bv.toB64(), bv.bits, bv.length);

}