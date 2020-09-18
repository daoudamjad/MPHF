//perfect hashing demo code for the first 50 MySQL Full-Text Stopwords listed on http://dev.mysql.com/doc/refman/5.1/en/fulltext-stopwords.html
//
//output of an mphf generator .. contact Dr. Amjad Daoud daoudamjad@gmail.com for your custom keyset
//code is incredibly fast for keys in input keyset; returns NOT FOUND when the key is not in input keyset using a bloom filter that is integerated
//with the mphf parameter bitmap arrays and use same hashes

#include <stdlib.h>
#include <strings.h>
#include <inttypes.h>

typedef enum { FALSE, TRUE } bool;
#define BASE 0
#define HEAD 1
#define TAIL 2
#define NOT_FOUND -1
#define IDXINCR switch (idx) { case BASE: idx=HEAD; break; case HEAD: idx=TAIL; break; case TAIL: idx=BASE;}
int32_t
hash(const void * __restrict key, size_t keylen)
{
    static const bool base[62] = {
    1,1,1,0,1,1,1,0,1,1,1,0,0,0,1,1,1,1,0,1,1,0,0,0,1,0,0,0,1,0,1,0,1,1,1,1,1,1,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0};
    static const bool head[62] = {
    0,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1,1,0,0,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,1,1,1,0,0,1,0,1,0,1,1,0,0,1,1,1,0,0,0,0};
    static const bool tail[62] = {
    0,1,0,0,0,1,1,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0,0,1,0,0,0,1,0,0,0,1,0,1,1,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0};
    register uint32_t idx = 0;
    register uint32_t h[3];
    register uint32_t x, y, z;
    register uint8_t loop;
    register char *s = key;
    register len = keylen;
    register const uint32_t Prime = 0x01000193;
    register uint32_t Seed  = 1649760492;
    x = Seed;
    loop= len-1; while(loop--) x = (*s++ ^x)*Prime; y=((x<<5)^*s); z=37*x+*s;
    h[0] = x = ((x)%(61));
    if (base[x]) {
        if (head[h[0]]) {IDXINCR; if (tail[h[0]]) {IDXINCR;}}
        y = (y)%(61);  z = (z)%(61);
        if(y == x && ++y > 62) y = 1;
        if(z == x && ++z > 62) z = 1;
        if(z == y){if(++z > 62) z = 1; if(z == x && ++z > 62) z = 1;}
        h[1] = y; h[2] = z;
        if (head[h[1]]) {IDXINCR; if (tail[h[1]]) {IDXINCR;}}
        if (head[h[2]]) {IDXINCR; if (tail[h[2]]) {IDXINCR;}}
        if ((idx !=0) && (head[x]+head[y]+head[z] == 0)) return NOT_FOUND;
        if (idx){idx = (idx > HEAD) ? h[TAIL]: h[HEAD];} else idx = h[BASE];
        return idx;
    }
    else return NOT_FOUND;
}
