/**
 * @author ZSY
 * @description test demo
 */
function sum(a,b){
    return a+b;
}
test('10+20应该等于30',()=>{
    const res=sum(10,20);
    // expect(res).toBe(30);
    expect(res).not.toBe(30);
});